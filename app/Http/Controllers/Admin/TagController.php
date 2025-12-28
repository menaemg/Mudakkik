<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;
use Inertia\Inertia;

class TagController extends Controller
{
   
    public function index(Request $request)
    {
        $tags = Tag::withCount('posts')
            ->latest()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();
        return Inertia::render('Admin/Components/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ], [
            'name.unique' => 'هذا الهاشتاج موجود بالفعل.',
            'name.required' => 'يرجى إدخال اسم الهاشتاج.'
        ]);
        $tag = Tag::create($validated);
        return redirect()->back()->with('success', "تم إضافة الهاشتاج #{$tag->name} بنجاح.");
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ], [
            'name.unique' => 'هذا الاسم مستخدم في هاشتاج آخر.',
            'name.required'=>'يرجى ادخال اسم الهاشتاج'
        ]);
        $tag->update($validated);
        return redirect()->back()->with('success', "تم تحديث الهاشتاج بنجاح.");
    }

    public function destroy(Tag $tag)
    {
        try {
            $name = $tag->name;
            $tag->delete();
            return back()->with('success', "تم حذف الهاشتاج #{$name} بنجاح.");
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء محاولة الحذف.');
        }
    }
}