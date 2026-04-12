import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import BlogPostCoverInput from '@/features/blogs/components/blog-post-cover-input';
import BlogPostEditor from '@/features/blogs/components/blog-post-editor';
import type { BlogPost } from '@/features/blogs/types';
import type { BlogPostFormLike } from '@/features/blogs/form-types';
import type {
    CreateBlogPostForm,
    EditBlogPostForm,
    BlogPostStatus,
} from '@/features/blogs/types';

type BlogPostFormData = CreateBlogPostForm | EditBlogPostForm;

interface BlogPostFormFieldsProps<TForm extends BlogPostFormData> {
    form: BlogPostFormLike<TForm>;
    mode: 'create' | 'edit';
    currentPost?: BlogPost | null;
    onUploadImage?: (file: File) => Promise<string>;
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function BlogPostFormFields<TForm extends BlogPostFormData>({
    form,
    mode,
    currentPost = null,
    onUploadImage,
}: BlogPostFormFieldsProps<TForm>) {
    const generateSlug = () => {
        form.setData('slug', slugify(form.data.title) as TForm['slug']);
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor={`${mode}-title`} className="mb-1 block text-sm font-medium">
                    Title
                </label>
                <input
                    id={`${mode}-title`}
                    type="text"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.currentTarget.value as TForm['title'])}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
                <InputError message={form.errors.title} />
            </div>

            <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                    <label htmlFor={`${mode}-slug`} className="block text-sm font-medium">
                        Slug
                    </label>
                    <button
                        type="button"
                        onClick={generateSlug}
                        className="text-xs text-primary hover:underline"
                    >
                        Generate from title
                    </button>
                </div>

                <input
                    id={`${mode}-slug`}
                    type="text"
                    value={form.data.slug}
                    onChange={(e) => form.setData('slug', e.currentTarget.value as TForm['slug'])}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
                <InputError message={form.errors.slug} />
            </div>

            <div>
                <label htmlFor={`${mode}-status`} className="mb-1 block text-sm font-medium">
                    Status
                </label>
                <Select
                    value={form.data.status}
                    onValueChange={(value) =>
                        form.setData('status', value as BlogPostStatus as TForm['status'])
                    }
                >
                    <SelectTrigger id={`${mode}-status`} className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={form.errors.status} />
            </div>

            <BlogPostCoverInput
                value={form.data.cover_image}
                onChange={(file) => form.setData('cover_image', file as TForm['cover_image'])}
                currentImagePath={currentPost?.cover_image_path ?? null}
            />
            <InputError message={form.errors.cover_image} />

            <div>
                <label className="mb-1 block text-sm font-medium">Content</label>
                <BlogPostEditor
                    value={form.data.content}
                    onChange={(value) => form.setData('content', value as TForm['content'])}
                    onUploadImage={onUploadImage}
                    placeholder="Write your blog content here..."
                />
                <InputError message={form.errors.content} />
            </div>
        </div>
    );
}
