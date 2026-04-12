import { Badge } from '@/components/ui/badge';
import type { BlogPostStatus } from '@/features/blogs/types';

interface BlogPostStatusBadgeProps {
    status: BlogPostStatus;
}

export default function BlogPostStatusBadge({ status }: BlogPostStatusBadgeProps) {
    if (status === 'published') {
        return (
            <Badge className="bg-[#106b42] text-white hover:bg-[#0c5132]">
                Published
            </Badge>
        );
    }

    return (
        <Badge variant="secondary">
            Draft
        </Badge>
    );
}
