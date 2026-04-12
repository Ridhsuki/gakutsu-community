import type { BlogPostSortField } from '@/features/blogs/types';

export const ADMIN_BLOGS_INDEX_URL = '/admin/blogs';
export const MENTOR_BLOGS_INDEX_URL = '/mentor/blogs';

export const BLOG_ALLOWED_SORT_FIELDS: readonly BlogPostSortField[] = [
    'title',
    'status',
    'published_at',
    'created_at',
    'author',
];
