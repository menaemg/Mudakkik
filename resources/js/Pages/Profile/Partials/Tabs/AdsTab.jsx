  import React from 'react';
  import { router, usePage } from '@inertiajs/react';
  import { Button } from "@/components/ui/button";
  import {
      FaBullhorn,
      FaPlus,
      FaCalendarAlt,
      FaCoins,
      FaCheckCircle,
      FaTimesCircle,
      FaHourglassHalf,
      FaGlobe,
      FaEye,
      FaEdit,
      FaTrash
  } from 'react-icons/fa';
  import { Badge } from "@/components/ui/badge";
  import Swal from 'sweetalert2';
  import Pagination from '@/Components/Pagination';

  export default function AdsTab({ adRequests, remainingDays, setActiveTab, setAdToEdit }) {

      const handleDelete = (ad) => {
          let confirmText = "";
          let confirmIcon = "warning";
          let confirmColor = "#d33";
          let confirmButtonText = "نعم، احذف";

          if (ad.status === 'pending') {
              confirmText = `الإعلان قيد المراجعة. سيتم حذفه واسترجاع ${ad.duration} يوم إلى رصيدك فوراً.`;
              confirmIcon = "info";
              confirmColor = "#3085d6";
              confirmButtonText = "نعم، احذف واسترجع الرصيد";
          } else if (ad.status === 'approved') {
              confirmText = "تحذير هام: الإعلان نشط أو تمت الموافقة عليه. حذفه الآن سيؤدي لإزالته ولن يتم استرجاع الرصيد المستهلك.";
              confirmIcon = "warning";
              confirmColor = "#d33";
          } else {
              confirmText = "سيتم إزالة الإعلان المرفوض من القائمة.";
              confirmIcon = "question";
              confirmColor = "#6b7280";
          }

          Swal.fire({
              title: 'هل أنت متأكد؟',
              text: confirmText,
              icon: confirmIcon,
              showCancelButton: true,
              confirmButtonColor: confirmColor,
              cancelButtonColor: '#71717a',
              confirmButtonText: confirmButtonText,
              cancelButtonText: 'تراجع'
          }).then((result) => {
              if (result.isConfirmed) {
                  const isLastItemOnPage = adRequests.data.length === 1;
                  const currentPage = adRequests.current_page;

                  let targetPage = currentPage;
                  if (isLastItemOnPage && currentPage > 1) {
                      targetPage = currentPage - 1;
                  }

                  router.delete(route('ads.destroy', ad.id), {
                      preserveScroll: true,
                      onSuccess: () => {
                          const url = new URL(window.location.href);

                          url.searchParams.set('tab', 'ads');

                          url.searchParams.set('ads_page', targetPage);

                          router.visit(url.toString(), {
                              preserveScroll: true,
                          });

                          const successTitle = ad.status === 'pending' ? 'تم الاسترجاع!' : 'تم الحذف!';
                          const successMsg = ad.status === 'pending'
                              ? 'تم حذف الإعلان وعاد الرصيد لمحفظتك.'
                              : 'تم حذف الإعلان بنجاح.';

                          Swal.fire(successTitle, successMsg, 'success');
                      },
                      onError: (errors) => {
                          Swal.fire('خطأ!', errors.general || 'حدث خطأ غير متوقع.', 'error');
                      }
                  });
              }
          });
      };

      const handleAction = (action, ad) => {
          if (action === 'edit_ad' && ad.status !== 'pending') {
              Swal.fire('تنبيه', 'لا يمكن تعديل الإعلان بعد مراجعته.', 'info');
              return;
          }

          setAdToEdit(ad);
          setActiveTab(action);
      };

      const getStatusBadge = (status) => {
          const styles = {
              pending: "bg-amber-50 text-amber-600 border-amber-200",
              approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
              rejected: "bg-red-50 text-red-600 border-red-200",
              waiting_payment: "bg-blue-50 text-blue-600 border-blue-200",
          };
          const icons = {
              pending: <FaHourglassHalf />,
              approved: <FaCheckCircle />,
              rejected: <FaTimesCircle />,
              waiting_payment: <FaCoins />,
          };
          const labels = {
              pending: "قيد المراجعة",
              approved: "نشط حالياً",
              rejected: "مرفوض",
              waiting_payment: "بانتظار الدفع",
          };
          return (
              <Badge className={`${styles[status] || styles.pending} border shadow-sm px-3 py-1.5 flex w-fit items-center gap-2 rounded-lg text-xs font-bold`}>
                  {icons[status]} {labels[status] || status}
              </Badge>
          );
      };

      return (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-100 pb-8 flex-shrink-0">
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-[#000a2e] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                              <FaBullhorn size={20} />
                          </div>
                          <h3 className="font-black text-3xl text-[#020617]">إدارة الحملات</h3>
                      </div>
                      <p className="text-gray-500 font-medium text-base max-w-lg pr-[3.75rem]">
                          راقب أداء إعلاناتك الحالية وتحكم في حملاتك الترويجية.
                      </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="bg-gradient-to-br from-[#020617] to-[#1e293b] p-4 rounded-2xl text-white shadow-xl shadow-gray-900/10 min-w-[160px] relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                          <div className="relative z-10 flex justify-between items-center">
                              <div>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">الرصيد المتاح</span>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-black text-white">{remainingDays}</span>
                                      <span className="text-xs text-gray-400 font-bold">يوم</span>
                                  </div>
                              </div>
                              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm text-amber-400">
                                  <FaCoins size={18} />
                              </div>
                          </div>
                      </div>

                      <Button
                          onClick={() => setActiveTab('create_ad')}
                          className="h-[4.5rem] px-6 rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-1 min-w-[100px] bg-brand-blue hover:bg-blue-700 text-white shadow-blue-500/30"
                      >
                          <FaPlus size={18} />
                          <span className="text-xs">حملة جديدة</span>
                      </Button>
                  </div>
              </div>

              <div className="flex-grow flex flex-col h-full">
                  {adRequests && adRequests.data.length > 0 ? (
                      <div className="overflow-hidden rounded-[2rem] border border-gray-100 shadow-sm flex-grow bg-white h-full flex flex-col">
                          <table className="w-full text-right flex-grow">
                              <thead className="bg-gray-50 text-gray-500 text-[11px] font-black uppercase tracking-wider">
                                  <tr>
                                      <th className="px-8 py-5">تفاصيل الإعلان</th>
                                      <th className="px-6 py-5">الفترة</th>
                                      <th className="px-6 py-5">الحالة</th>
                                      <th className="px-6 py-5">إجراءات</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 bg-white">
                                  {adRequests.data.map((ad) => (
                                      <tr key={ad.id} className="hover:bg-blue-50/20 transition-colors group">
                                          <td className="px-8 py-5">
                                              <div className="flex items-center gap-4">
                                                  <div className="w-20 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 relative group-hover:scale-105 transition-transform">
                                                      <img src={`/storage/${ad.image_path}`} alt={ad.title} className="w-full h-full object-cover" />
                                                  </div>
                                                  <div>
                                                      <p className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{ad.title}</p>
                                                      <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline flex items-center gap-1 font-medium" dir="ltr">
                                                          <FaGlobe size={10} /> {new URL(ad.target_url).hostname}
                                                      </a>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-6 py-5">
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                      <FaCalendarAlt className="text-gray-400 text-[10px]" />
                                                      {new Date(ad.requested_start_date).toLocaleDateString('ar-EG')}
                                                  </span>
                                                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                                                      لمدة {ad.duration} أيام
                                                  </span>
                                              </div>
                                          </td>
                                          <td className="px-6 py-5">
                                              {getStatusBadge(ad.status)}
                                          </td>
                                          <td className="px-6 py-5">
                                              <div className="flex items-center gap-2">
                                                  <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      onClick={() => handleAction('view_ad', ad)}
                                                      className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                      title="معاينة التفاصيل"
                                                  >
                                                      <FaEye size={14} />
                                                  </Button>

                                                  {ad.status === 'pending' && (
                                                      <Button
                                                          size="icon"
                                                          variant="ghost"
                                                          onClick={() => handleAction('edit_ad', ad)}
                                                          className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                                                          title="تعديل الطلب"
                                                      >
                                                          <FaEdit size={14} />
                                                      </Button>
                                                  )}

                                                  <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      onClick={() => handleDelete(ad)}
                                                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                      title="حذف"
                                                  >
                                                      <FaTrash size={14} />
                                                  </Button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                          <div className="mt-auto p-4 border-t border-gray-100">
                              <Pagination links={adRequests.links} />
                          </div>
                      </div>
                  ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-[2.5rem] border-2 border-dashed border-gray-100 min-h-[300px] h-full">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-50">
                              <FaBullhorn className="text-4xl text-gray-200" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">لا توجد حملات نشطة</h4>
                          <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-6">لم تقم بإنشاء أي حملات إعلانية بعد. استثمر نقاطك الآن.</p>
                          <Button onClick={() => setActiveTab('create_ad')} className="bg-white border border-gray-200 text-gray-700 hover:border-brand-blue hover:text-brand-blue font-bold rounded-xl px-6 h-12 shadow-sm">
                              إنشاء حملة جديدة
                          </Button>
                      </div>
                  )}
              </div>
          </div>
      );
  }
