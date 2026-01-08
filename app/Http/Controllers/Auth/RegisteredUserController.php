<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'unique:users',
                'regex:/^[a-zA-Z0-9._-]+$/',
            ],
            'role' => 'nullable|string|in:user,journalist,admin'
        ], [
            'username.required' => 'اسم المستخدم مطلوب.',
            'username.min' => 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل.',
            'username.unique' => 'اسم المستخدم هذا مستخدم بالفعل.',
            'username.regex' => 'اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام ونقاط وشرطات وشرطات سفلية فقط.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'role' => 'user',
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect to email verification notice
        return redirect(route('verification.notice', absolute: false))
            ->with('status', 'تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق لتفعيل حسابك.');
    }
}
