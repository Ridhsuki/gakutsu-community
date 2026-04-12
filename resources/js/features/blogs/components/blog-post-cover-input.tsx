import { useEffect, useMemo, useState } from 'react';

interface BlogPostCoverInputProps {
    value: File | null;
    onChange: (file: File | null) => void;
    currentImagePath?: string | null;
}

export default function BlogPostCoverInput({
    value,
    onChange,
    currentImagePath = null,
}: BlogPostCoverInputProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const currentImageUrl = useMemo(() => {
        if (!currentImagePath) return null;

        return `/storage/${currentImagePath}`;
    }, [currentImagePath]);

    useEffect(() => {
        if (!value) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(value);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    return (
        <div className="space-y-3">
            <div>
                <label htmlFor="cover_image" className="mb-1 block text-sm font-medium">
                    Cover Image
                </label>
                <input
                    id="cover_image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                />
            </div>

            {(previewUrl || currentImageUrl) && (
                <div className="overflow-hidden rounded-md border border-border">
                    <img
                        src={previewUrl || currentImageUrl || ''}
                        alt="Cover preview"
                        className="h-48 w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}
