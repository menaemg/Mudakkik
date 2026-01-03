import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Report({ post }) {

    const { data, setData, post: submit, processing, errors } = useForm({
        reason: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        submit(route('posts.report.store', post.id));
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-xl font-bold mb-4">
                    الإبلاغ عن المقال: {post.title}
                </h1>

                <form onSubmit={submitForm}>
                    <textarea
                        className="w-full border rounded p-2"
                        rows="5"
                        placeholder="اكتب سبب البلاغ..."
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                    />

                    {errors.reason && (
                        <div className="text-red-600 mt-2">
                            {errors.reason}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                    >
                        إرسال البلاغ
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
