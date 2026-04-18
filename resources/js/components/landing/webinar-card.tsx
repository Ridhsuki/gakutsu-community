import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User } from 'lucide-react';

export interface WebinarItem {
    id: number;
    title: string;
    category: string;
    date: string;
    time: string;
    mentor: string;
    mentorRole: string;
    isLive?: boolean;
    isFree?: boolean;
}

interface WebinarCardProps {
    webinar: WebinarItem;
}

export default function WebinarCard({ webinar }: WebinarCardProps) {
    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#106b42] to-[#1a9b5f]" />

            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-[#e6f4ed] text-[#106b42] hover:bg-[#d0eadc] border-0 font-medium">
                        {webinar.category}
                    </Badge>
                    {webinar.isLive && (
                        <Badge className="bg-red-500 text-white border-0 font-medium animate-pulse">
                            🔴 Live
                        </Badge>
                    )}
                    {webinar.isFree && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 font-medium">
                            Gratis
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-[#106b42] transition-colors duration-200">
                    {webinar.title}
                </h3>

                {/* Schedule info */}
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 shrink-0 text-[#106b42]" />
                        <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 shrink-0 text-[#106b42]" />
                        <span>{webinar.time} WIB</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Mentor */}
                <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#106b42]/10 text-sm font-bold text-[#106b42]">
                        {webinar.mentor.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">{webinar.mentor}</p>
                        <p className="truncate text-xs text-gray-500">{webinar.mentorRole}</p>
                    </div>
                    <User className="ml-auto size-4 shrink-0 text-gray-300" />
                </div>

                {/* CTA */}
                <a
                    href="#"
                    className="mt-auto inline-flex items-center justify-center rounded-xl bg-[#106b42] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0d5a38] active:scale-95"
                >
                    Daftar Sekarang
                </a>
            </div>
        </article>
    );
}
