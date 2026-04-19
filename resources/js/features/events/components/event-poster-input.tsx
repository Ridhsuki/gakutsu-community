import BlogPostCoverInput from '@/features/blogs/components/blog-post-cover-input';

export default function EventPosterInput({
    value,
    onChange,
    currentImagePath,
}: {
    value: File | null;
    onChange: (file: File | null) => void;
    currentImagePath?: string | null;
}) {
    return (
        <BlogPostCoverInput
            value={value}
            onChange={onChange}
            currentImagePath={currentImagePath}
        />
    );
}
