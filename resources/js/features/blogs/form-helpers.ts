import type {
    BlogPost,
    CreateBlogPostForm,
    EditBlogPostForm,
} from '@/features/blogs/types';

export function getDefaultCreateBlogPostForm(): CreateBlogPostForm {
    return {
        title: '',
        slug: '',
        status: 'draft',
        cover_image: null,
        content: '',
    };
}

export function getDefaultEditBlogPostForm(): EditBlogPostForm {
    return {
        title: '',
        slug: '',
        status: 'draft',
        cover_image: null,
        content: '',
    };
}

export function mapBlogPostToEditBlogPostForm(
    post: BlogPost,
): EditBlogPostForm {
    return {
        title: post.title,
        slug: post.slug,
        status: post.status,
        cover_image: null,
        content: post.content,
    };
}
