<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use App\Models\HomeSlot;
use App\Http\Requests\Admin\StorePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::with(['category', 'user', 'tags'])
            ->withCount('likes')
            ->latest()
            ->filter($request)
            ->paginate(10)
            ->withQueryString();

        $categories = Category::select('id', 'name')->limit(100)->get();
        $tags = Tag::select('id', 'name')->limit(100)->get();

        return Inertia::render('Admin/Components/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'status', 'category', 'verdict']),
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $allPinnedIds = HomeSlot::whereNotNull('post_id')
            ->pluck('post_id')
            ->toArray();

        $posts = Post::query()
            ->where('title', 'like', "%{$query}%")
            ->where('status', 'published')
            ->whereNotIn('id', $allPinnedIds)
            ->where(function($q) {
                 $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict');
            })
            ->latest()
            ->take(20)
            ->get(['id', 'title', 'image', 'slug', 'user_id']);

        $posts->load('user:id,name');

        return response()->json($posts);
    }

    public function toggleFeatured(Post $post)
    {
        $post->update([
            'is_featured' => !$post->is_featured
        ]);
        return back()->with('success', 'تم تحديث حالة تميز المقال بنجاح');
    }

    public function toggleFeature(Request $request, Post $post)
    {
        $feature = $request->input('feature');
        $allowedFeatures = ['is_cover_story', 'is_breaking', 'is_editor_choice', 'is_featured', 'status'];

        if (in_array($feature, $allowedFeatures)) {
            if ($feature === 'is_cover_story' && !$post->is_cover_story) {
                Post::where('is_cover_story', true)->update(['is_cover_story' => false]);
            }

        if ($feature === 'status') {
            $post->update([
                'status' => $post->status === 'published' ? 'pending' : 'published'
            ]);
        } else {
            $post->update([
                $feature => !$post->$feature
            ]);
        }
     }
        return back()->with('success', 'تم تحديث حالة المقال بنجاح');
    }


    /**
     * Store a newly created resource in storage.
     */

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $validated['image'] = $path;
        }

        DB::transaction(function () use ($validated, $request) {
            $post = Post::create([
                'title' => $validated['title'],
                'body' => $validated['body'],
                'category_id' => $validated['category_id'],
                'image' => $validated['image'] ?? null,
                'user_id' => Auth::id(),
                'status' => $validated['status'] ?? 'pending',
                'ai_verdict' => $validated['ai_verdict'] ?? 'trusted',
            ]);

            if ($request->has('tag_ids')) {
                $post->tags()->attach($request->tag_ids);
            }
        });

        return redirect()->route('admin.posts.index')->with('success', 'تم إنشاء المقال بنجاح');
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(StorePostRequest $request, Post $post)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $post, $validated) {
            if ($request->hasFile('image')) {
                $newPath = $request->file('image')->store('posts', 'public');
                if ($post->image && Storage::disk('public')->exists($post->image)) {
                    Storage::disk('public')->delete($post->image);
                }
                $post->image = $newPath;
            }

            $post->update([
                'title'       => $validated['title'],
                'body'        => $validated['body'],
                'category_id' => $validated['category_id'],
            ]);

            if (isset($validated['tag_ids'])) {
                $post->tags()->sync($validated['tag_ids']);
            } else {
                $post->tags()->detach();
            }
        });

        return back()->with('success', 'تم تحديث المقال بنجاح وبأمان');
    }
    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Post $post)
    {
        try {
            DB::transaction(function () use ($post) {
                $imagePath = $post->getRawOriginal('image');

                $post->tags()->detach();
                $post->delete();

                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            });

            return back()->with('success', 'تم حذف المقال وكل ملفاته بنجاح');

        } catch (\Exception $e) {
            Log::error('فشل حذف المقال: ' . $e->getMessage(), ['post_id' => $post->id]);
            return back()->with('error', 'عذراً، حدث خطأ أثناء محاولة الحذف');
        }
    }
}
