export type BlogPostStatus = 'draft' | 'published';

export type BlogPostSortField =
    'title' | 'status' | 'published_at' | 'created_at' | 'author';

export type BlogManagementViewMode = 'table' | 'cards';

export interface BlogPostAuthor {
    id: number;
    name: string;
}

export interface BlogPost {
    id: number;
    author_id: number;
    title: string;
    slug: string;
    status: BlogPostStatus;
    cover_image_path: string | null;
    cover_image_url: string | null;
    content: string;
    published_at: string | null;
    created_at: string;
    author?: BlogPostAuthor | null;
}

export interface CreateBlogPostForm {
    title: string;
    slug: string;
    status: BlogPostStatus;
    cover_image: File | null;
    content: string;
}

export interface EditBlogPostForm {
    title: string;
    slug: string;
    status: BlogPostStatus;
    cover_image: File | null;
    content: string;
}
