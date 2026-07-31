import { Link } from '@inertiajs/react';
import { Clock3, User2 } from 'lucide-react';
import BlogPostCoverThumbnail from '@/features/blogs/components/blog-post-cover-thumbnail';

type BlogCardItem = {
    id: number;
    title: string;
    slug: string;
    cover_image_url?: string | null;
    excerpt: string;
    published_at?: string | null;
    author?: {
        name: string;
    } | null;
};

function formatDate(value: string | null | undefined) {
    if (!value) {
return '-';
}

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
return '-';
}

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function BlogPublicCard({ post }: { post: BlogCardItem }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <BlogPostCoverThumbnail
                src={post.cover_image_url ?? null}
                alt={post.title}
                className="aspect-[16/10] w-full rounded-none border-0"
                imageClassName="h-full w-full object-cover"
            />

            <div className="space-y-4 p-5">
                <div className="space-y-2">
                    <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4" />
                        <span>{post.author?.name ?? '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>{formatDate(post.published_at)}</span>
                    </div>
                </div>

                <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                    Baca Artikel
                </Link>
            </div>
        </article>
    );
}
