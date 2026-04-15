import BlogManagementPage, {
    type BlogManagementPageSharedProps,
} from '@/features/blogs/pages/blog-management-page';
import { ADMIN_BLOGS_INDEX_URL } from '@/features/blogs/constants';

export default function AdminBlogIndex(props: BlogManagementPageSharedProps) {
    return (
        <BlogManagementPage
            {...props}
            endpoint={ADMIN_BLOGS_INDEX_URL}
            headTitle="Blog Management"
            title="Blog Management"
            description="Manage blog posts published by admins and mentors."
        />
    );
}
