import BlogManagementPage, {
    type BlogManagementPageSharedProps,
} from '@/features/blogs/pages/blog-management-page';
import { MENTOR_BLOGS_INDEX_URL } from '@/features/blogs/constants';

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
