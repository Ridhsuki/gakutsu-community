import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    author: string;
    publishedAt: string;
    imageBg: string;
    imageEmoji: string;
}

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Placeholder Image */}
            <div
                className={`relative flex h-48 w-full items-center justify-center overflow-hidden ${post.imageBg} transition-transform duration-300 group-hover:scale-[1.02]`}
            >
                <span className="text-6xl select-none">{post.imageEmoji}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-[#106b42] hover:bg-white border-0 text-xs font-semibold backdrop-blur-sm">
                        {post.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-[#106b42] transition-colors duration-200 line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#106b42]/10 text-xs font-bold text-[#106b42]">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700">{post.author}</p>
                            <p className="text-xs text-gray-400">{post.publishedAt}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="size-3" />
                        <span>{post.readTime}</span>
                    </div>
                </div>

                <a
                    href="#"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-[#106b42] hover:gap-2.5 transition-all duration-200"
                >
                    Baca Selengkapnya
                    <ArrowRight className="size-4" />
                </a>
            </div>
        </article>
    );
}
