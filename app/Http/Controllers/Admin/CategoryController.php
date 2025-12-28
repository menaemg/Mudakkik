<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;



class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::withCount('posts')
        ->latest()
            ->filter($request)
            ->paginate(10)
            ->withQueryString();
        return Inertia::render('Admin/Components/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search'])
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCategoryRequest $request, Category $category)
    {
        $validated= $request->validated();
        $category->update([
            'name'=>$validated['name'],
            'slug'=>$validated['slug'],
            'description'=>$validated['description'],
        ]);
        return redirect()->back()->with('success',"تم تحديث بيانات {$category->name} بنجاح");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->posts()->exists()) {
            return back()->with('error', "لا يمكن حذف الفئة ({$category->name}) لأنها تحتوي على مقالات مرتبطة بها.");
        }

        try {
            $name = $category->name;
            $category->delete();
            return back()->with('success', "تم حذف الفئة ({$name}) بنجاح.");
        } catch (\Exception $e) {     
            return back()->with('error', 'حدث خطأ غير متوقع أثناء محاولة الحذف.');
        }
    }
    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();
        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description']
        ]);
        return redirect()->back()->with('success', "تم إنشاء الفئة {$category->name} بنجاح.");
    }
}
