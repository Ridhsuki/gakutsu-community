import BlogPostEditor from '@/features/blogs/components/blog-post-editor';

export default function EventDescriptionEditor({
    value,
    onChange,
    onUploadImage,
}: {
    value: string;
    onChange: (value: string) => void;
    onUploadImage?: (file: File) => Promise<string>;
}) {
    return (
        <BlogPostEditor
            value={value}
            onChange={onChange}
            onUploadImage={onUploadImage}
            placeholder="Write your event description here..."
        />
    );
}
