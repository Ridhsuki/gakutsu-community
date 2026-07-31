import { MENTOR_BLOGS_INDEX_URL } from '@/features/blogs/constants';
import BlogManagementPage from '@/features/blogs/pages/blog-management-page';
import type { BlogManagementPageSharedProps } from '@/features/blogs/pages/blog-management-page';

export default function MentorBlogIndex(props: BlogManagementPageSharedProps) {
    return (
        <BlogManagementPage
            {...props}
            endpoint={MENTOR_BLOGS_INDEX_URL}
            headTitle="My Blog Posts"
            title="My Blog Posts"
            description="Manage your own draft and published blog posts."
        />
    );
}
