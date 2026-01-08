@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo-v2.1.png" class="logo" alt="Laravel Logo">
@else
{{-- Brand Logo Box --}}
<div style="width: 48px; height: 48px; background: linear-gradient(135deg, #b20e1e, #8b0a17); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(178, 14, 30, 0.3);">
    <span style="font-weight: 900; font-size: 28px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;">مـ</span>
</div>
<span style="font-weight: 900; font-size: 24px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;">
    مدقق<span style="color: #b20e1e;">.</span> نيوز
</span>
@endif
</a>
</td>
</tr>
