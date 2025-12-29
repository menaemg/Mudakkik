<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Tag;

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
    public function toggleFeatured(Post $post)
    {
        $post->update([
            'is_featured' => !$post->is_featured
        ]);
        return back()->with('success', 'تم تحديث حالة تميز المقال بنجاح');
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

        $post = DB::transaction(function () use ($validated, $request) {
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

            return $post;
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
            if ($post->image) {
                if (Storage::disk('public')->exists($post->getRawOriginal('image'))) {
                    Storage::disk('public')->delete($post->getRawOriginal('image'));
                }
            }
            $post->tags()->detach();
            $post->delete();
            return back()->with('success', 'تم حذف المقال وكل ملفاته بنجاح.');
        } catch (\Exception $e) {
            return back()->with('error', 'عذراً، حدث خطأ أثناء محاولة الحذف.');
        }
    }
}
