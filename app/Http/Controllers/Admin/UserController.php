<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Http\Requests\StoreUserRequest;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::latest()
            ->withCount(['posts', 'followers', 'following', 'likes'])
            ->filter($request)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Components/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }
    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();

        return back()->with('success', "تم حذف حساب {$name} بنجاح.");
    }

    public function store(StoreUserRequest $request)
    {

        $validated = $request->validated();
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'bio' => $validated['bio'] ?? null,

            'password' => Hash::make($validated['password']),

            'credibility_score' => $validated['role'] === 'journalist' ? ($validated['credibility_score'] ?? 0) : 0,
            'is_verified_journalist' => ($validated['role'] === 'journalist' && $request->boolean('is_verified_journalist')),
        ]);

        return redirect()->back()->with('success', "تم إنشاء حساب {$user->name} بنجاح.");
    }
    public function update(StoreUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'bio' => $validated['bio'] ?? null,
            'credibility_score' => $validated['role'] === 'journalist' ? ($validated['credibility_score'] ?? 0) : 0,
            'is_verified_journalist' => ($validated['role'] === 'journalist' && $request->boolean('is_verified_journalist')),
        ]);

        return redirect()->back()->with('success', "تم تحديث بيانات {$user->name} بنجاح");
    }
}
