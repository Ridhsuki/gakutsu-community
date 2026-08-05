import { router } from '@inertiajs/react';
import { useState } from 'react';
import PaginationBar from '@/components/data-table/pagination-bar';
import BlogPublicCard from '@/components/public/blog-public-card';
import SeoHead from '@/components/public/seo-head';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import type { PaginatedResponse } from '@/types/pagination';

interface BlogPostItem {
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

export default function BlogsIndex({
    posts,
    filters,
}: {
    posts: PaginatedResponse<BlogPostItem>;
    filters: { search?: string | null };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get('/blogs', value.trim() ? { search: value.trim() } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['posts', 'filters'],
        });
    };

    return (
        <PublicLayout>
            <SeoHead />

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-8 space-y-2">
                    <p className="text-sm font-medium text-primary">Blog</p>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Artikel dan insight terbaru
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Kumpulan tulisan tentang IT, cyber security,
                        pengembangan karier, dan pembelajaran komunitas.
                    </p>
                </div>

                <div className="mb-8 max-w-md">
                    <Input
                        value={search}
                        onChange={(e) => handleSearch(e.currentTarget.value)}
                        placeholder="Cari artikel..."
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.data.map((post) => (
                        <BlogPublicCard
                            key={post.id}
                            post={{
                                ...post,
                                excerpt:
                                    String(post.content ?? '')
                                        .replace(/<[^>]*>/g, '')
                                        .slice(0, 140) + '...',
                            }}
                        />
                    ))}
                </div>

                <div className="mt-8">
                    <PaginationBar
                        links={posts.links}
                        from={posts.from}
                        to={posts.to}
                        total={posts.total}
                        lastPage={posts.last_page}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}
