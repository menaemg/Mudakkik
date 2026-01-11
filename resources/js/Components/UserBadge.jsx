import React from 'react';
import {
    FaCrown,
    FaPenNib,
    FaGem,
    FaCheckCircle,
} from 'react-icons/fa';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

const BadgeItem = ({ icon: Icon, colorClass, bgClass, ringClass, tooltip }) => (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <div className={`
                    flex items-center justify-center w-7 h-7 rounded-full
                    ${bgClass} ${ringClass} ring-2 shadow-md
                    transition-transform hover:scale-110 cursor-help
                `}>
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white border-gray-700 font-bold text-sm py-1 px-3">
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default function UserBadge({ user, verificationBadgeLevel, className = "" }) {
    if (!user) return null;

    const role = user.role;

    return (
        <div className={`inline-flex items-center gap-3 ${className}`}>


            {role === 'admin' && (
                <BadgeItem
                    icon={FaCrown}
                    colorClass="text-yellow-100"
                    bgClass="bg-red-600"
                    ringClass="ring-red-600"
                    tooltip="المسئول"
                />
            )}

            {role === 'journalist' && (
                <BadgeItem
                    icon={FaPenNib}
                    colorClass="text-white"
                    bgClass="bg-blue-600"
                    ringClass="ring-blue-600"
                    tooltip="صحفي معتمد"
                />
            )}


            {verificationBadgeLevel === 'platinum' && (
                <BadgeItem
                    icon={FaGem}
                    colorClass="text-gray-50"
                    bgClass="bg-gradient-to-tr from-gray-600 via-gray-400 to-gray-200"
                    ringClass="ring-gray-400/70"
                    tooltip="عضوية بلاتينية"
                />
            )}

            {verificationBadgeLevel === 'gold' && (
                <BadgeItem
                    icon={FaGem}
                    colorClass="text-white"
                    bgClass="bg-gradient-to-tr from-yellow-400 to-orange-500"
                    ringClass="ring-yellow-300"
                    tooltip="عضوية ذهبية"
                />
            )}

            {verificationBadgeLevel === 'bronze' && (
                <BadgeItem
                    icon={FaCheckCircle}
                    colorClass="text-white"
                    bgClass="bg-gradient-to-tr from-orange-700 to-orange-900"
                    ringClass="ring-orange-600"
                    tooltip="عضوية برونزية"
                />
            )}

        </div>
    );
}
