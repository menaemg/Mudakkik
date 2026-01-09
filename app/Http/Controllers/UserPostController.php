<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ContentReviewService;
use App\Notifications\PostPublished;
use App\Notifications\PostRejected;
use App\Notifications\PostMarkedFake;
use App\Jobs\AuditPostContent;


class UserPostController extends Controller
{
    public function create()
    {
        return Inertia::render('Profile/Posts/Create', [
            'categories' => \App\Models\Category::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string|min:50',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'type' => 'required|in:article,news',
        ]);

        $imagePath = $request->file('image')->store('posts', 'public');

        $post = $request->user()->posts()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . time(),
            'body' => $validated['body'],
            'category_id' => $validated['category_id'],
            'image' => $imagePath,
            'type' => $validated['type'],
            'status' => 'pending', 
        ]);

        AuditPostContent::dispatch($post);

        return redirect()->route('profile.edit')->with('warning', 'تم استلام مقالك بنجاح، سيتم تدقيقه آلياً وإشعارك بالنتيجة فوراً.');
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:article,news',
            'image' => 'nullable|image|max:2048',
        ]);


        if ($request->hasFile('image')) {
            $oldImage = $post->getRawOriginal('image');
            if ($oldImage) {
                Storage::disk('public')->delete($oldImage);
            }
            $validated['image'] = $request->file('image')->store('posts', 'public');
        } else {
            unset($validated['image']);
        }

        $post->update(array_merge($validated, [
            'status' => 'pending'
        ]));

        return back()->with('success', 'تم تحديث المقال بنجاح وإرساله للمراجعة.');
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        $imagePath = $post->getRawOriginal('image');
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $post->delete();

        return back()->with('success', 'تم حذف المقال بنجاح.');
    }
}
