import { Link } from '@inertiajs/react';
import BlogPublicCard from '@/components/public/blog-public-card';
import SeoHead from '@/components/public/seo-head';
import RenderRichText from '@/components/rich-text/render-rich-text';
import BlogPostCoverThumbnail from '@/features/blogs/components/blog-post-cover-thumbnail';
import PublicLayout from '@/layouts/public-layout';

interface PostItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    cover_image_url?: string | null;
    published_at?: string | null;
    author?: {
        name: string;
    } | null;
}

export default function BlogShow({
    post,
    relatedPosts,
}: {
    post: PostItem;
    relatedPosts: PostItem[];
}) {
    return (
        <PublicLayout>
            <SeoHead
                title={post.title}
                description={String(post.content ?? '')
                    .replace(/<[^>]*>/g, '')
                    .slice(0, 155)}
                image={post.cover_image_url ?? null}
                type="article"
            />

            <div className="mx-auto max-w-5xl px-4 py-12">
                <Link
                    href="/blogs"
                    className="inline-flex text-sm font-medium text-primary"
                >
                    ← Kembali ke blog
                </Link>

                <div className="mt-6 space-y-4">
                    <p className="text-sm font-medium text-primary">
                        Blog Artikel
                    </p>
                    <h1 className="max-w-4xl text-4xl font-semibold tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Author: {post.author?.name ?? '-'}</span>
                        <span>
                            Published:{' '}
                            {post.published_at
                                ? new Date(
                                      post.published_at,
                                  ).toLocaleDateString('id-ID', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                  })
                                : '-'}
                        </span>
                    </div>
                </div>

                {post.cover_image_url ? (
                    <BlogPostCoverThumbnail
                        src={post.cover_image_url}
                        alt={post.title}
                        className="mt-8 aspect-[16/9] max-h-[420px] w-full rounded-3xl"
                        imageClassName="max-h-[420px] object-cover"
                        loading="eager"
                    />
                ) : null}

                <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <RenderRichText html={post.content} />
                </div>

                {relatedPosts.length > 0 ? (
                    <section className="mt-12">
                        <div className="mb-6 space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Artikel terkait
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Beberapa tulisan lain yang mungkin relevan untuk
                                dibaca berikutnya.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {relatedPosts.map((related) => (
                                <BlogPublicCard
                                    key={related.id}
                                    post={{
                                        ...related,
                                        excerpt:
                                            String(related.content ?? '')
                                                .replace(/<[^>]*>/g, '')
                                                .slice(0, 140) + '...',
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </PublicLayout>
    );
}
