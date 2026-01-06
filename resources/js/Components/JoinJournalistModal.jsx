import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { FaPaperPlane, FaTimes, FaFileUpload, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function JoinJournalistModal({ isOpen, onClose }) {

    const { data, setData, post, processing, reset, errors } = useForm({
        request_message: '',
        documents: null,
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('upgrade-requests.store'), {
            onSuccess: () => {
                reset();
                onClose();
                Swal.fire({
                    icon: 'success',
                    title: 'تم إرسال الطلب',
                    text: 'سيقوم المسؤولون بمراجعة طلبك والرد عليك قريباً.',
                    confirmButtonColor: '#000a2e'
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'يرجى التأكد من إدخال البيانات بشكل صحيح.',
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden m-4 transform transition-all scale-100">

                <div className="bg-[#000a2e] p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaPaperPlane className="text-brand-red" /> طلب انضمام للصحفيين
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/*  */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-4">
                        يرجى تزويدنا بنبذة عن خبرتك الصحفية، وإرفاق نماذج من أعمالك السابقة أو بطاقة العضوية النقابية (إن وجدت) بصيغة PDF أو صور.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">رسالة الطلب (نبذة عنك)</label>
                        <textarea
                            value={data.request_message}
                            onChange={(e) => setData('request_message', e.target.value)}
                            className="w-full border-gray-200 rounded-xl focus:border-brand-blue focus:ring-brand-blue min-h-[120px] p-3 text-sm"
                            placeholder="أكتب هنا لماذا تريد الانضمام وما هي خبراتك..."
                            required
                        ></textarea>
                        {errors.request_message && <p className="text-red-500 text-xs">{errors.request_message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">المرفقات (CV، نماذج أعمال، بطاقة)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer group">
                            <input
                                type="file"
                                onChange={(e) => setData('documents', e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <FaFileUpload className="text-3xl text-gray-300 group-hover:text-brand-blue mb-2 transition-colors" />
                            <p className="text-sm text-gray-500 font-medium">
                                {data.documents ? data.documents.name : 'اضغط هنا لرفع الملفات'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG (Max 5MB)</p>
                        </div>
                        {errors.documents && <p className="text-red-500 text-xs">{errors.documents}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#000a2e] hover:bg-blue-900 text-white gap-2"
                        >
                            {processing ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />} إرسال الطلب
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
