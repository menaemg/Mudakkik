@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-flex; align-items: center; gap: 12px; text-decoration: none;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo-v2.1.png" class="logo" alt="Laravel Logo">
@else
{{-- Brand Logo Icon --}}
<div style="width: 42px; height: 42px; background: linear-gradient(135deg, #b20e1e, #991b1b); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(153, 27, 27, 0.4); border: 1px solid rgba(255, 255, 255, 0.1);">
    <span style="font-weight: 900; font-size: 24px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; padding-bottom: 4px;">مـ</span>
</div>

{{-- Brand Logo Text --}}
<div style="display: flex; flex-direction: column; justify-content: center; text-align: right;">
    <span style="font-weight: 900; font-size: 24px; color: white; line-height: 1; letter-spacing: -0.025em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;">
        مدقق<span style="color: #b20e1e;">.</span>
    </span>
    <span style="font-size: 10px; font-weight: 700; color: #9ca3af; letter-spacing: 0.2em; margin-top: -2px; margin-right: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;">
        نيوز
    </span>
</div>
@endif
</a>
</td>
</tr>
