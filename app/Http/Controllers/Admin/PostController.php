<?php

namespace App\Http\Controllers\Admin;

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
        $categories = Category::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();

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

        $validated['user_id'] = auth()->id();

        $post = Post::create($validated);
        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }
        return redirect()->route('admin.posts.index')
            ->with('success', 'تم إنشاء ونشر المقال بنجاح!');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
      
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'body'        => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
            'tag_ids'     => 'nullable|array',
            'tag_ids.*'   => 'exists:tags,id',
        ]);

        $post->fill([
            'title'       => $validated['title'],
            'body'        => $validated['body'],
            'category_id' => $validated['category_id'],
        ]);
        if ($request->hasFile('image')) {
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }

            $path = $request->file('image')->store('posts', 'public');
            $post->image = $path;
        }

        
        $post->save();

        if (isset($validated['tag_ids'])) {
            $post->tags()->sync($validated['tag_ids']);
        }

        return back()->with('success', 'تم تحديث المقال بنجاح');
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
