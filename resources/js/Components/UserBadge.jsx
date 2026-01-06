import React from 'react';
import { FaCrown, FaPenNib, FaStar, FaShieldAlt } from 'react-icons/fa';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

const BadgeIcon = ({ icon: Icon, colorClass, bgClass, tooltip }) => (
    <TooltipProvider>
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 cursor-help ${bgClass} border-white/20`}>
                    <Icon className={`w-3 h-3 ${colorClass}`} />
                </div>
            </TooltipTrigger>
            <TooltipContent className="bg-[#020617] text-white border border-gray-700 text-xs font-bold">
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default function UserBadge({ user, planSlug, className = "" }) {
    if (!user) return null;

    if (user.role === 'admin') {
        return (
            <div className={`inline-flex items-center gap-1 ${className}`}>
                <BadgeIcon
                    icon={FaCrown}
                    bgClass="bg-gradient-to-br from-red-600 to-red-800"
                    colorClass="text-white"
                    tooltip="مدير المنصة (Admin)"
                />
            </div>
        );
    }

    const isJournalist = user.role === 'journalist';
    let PlanBadge = null;

    if (planSlug === 'pro-yearly') {
        PlanBadge = (
            <BadgeIcon
                icon={FaShieldAlt}
                bgClass="bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700"
                colorClass="text-white"
                tooltip="عضوية بلاتينية (VIP)"
            />
        );
    }
    else if (planSlug === 'pro') {
        PlanBadge = (
            <BadgeIcon
                icon={FaShieldAlt}
                bgClass="bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600"
                colorClass="text-white"
                tooltip="عضوية ذهبية (Gold)"
            />
        );
    }
    else if (planSlug === 'basic') {
        PlanBadge = (
            <BadgeIcon
                icon={FaStar}
                bgClass="bg-gradient-to-br from-orange-300 to-orange-500"
                colorClass="text-white"
                tooltip="عضوية برونزية (Basic)"
            />
        );
    }

    let RoleBadge = null;
    if (isJournalist) {
        RoleBadge = (
            <BadgeIcon
                icon={FaPenNib}
                bgClass="bg-[#020617]"
                colorClass="text-blue-400"
                tooltip="صحفي معتمد (Journalist)"
            />
        );
    }

    if (!PlanBadge && !RoleBadge) return null;

    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            {RoleBadge}
            {PlanBadge}
        </div>
    );
}
