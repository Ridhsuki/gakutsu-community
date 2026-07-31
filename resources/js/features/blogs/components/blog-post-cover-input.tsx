import { useEffect, useMemo, useRef, useState } from 'react';

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
    const objectUrlRef = useRef<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentImageUrl = useMemo(() => {
        if (!currentImagePath) {
            return null;
        }

        return `/storage/${currentImagePath}`;
    }, [currentImagePath]);

    const displayedImageUrl = value ? previewUrl : currentImageUrl;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);

        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        if (file) {
            const url = URL.createObjectURL(file);
            objectUrlRef.current = url;
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    useEffect(() => {
        if (!value && objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    return (
        <div className="space-y-3">
            <div>
                <label
                    htmlFor="cover_image"
                    className="mb-1 block text-sm font-medium"
                >
                    Cover Image
                </label>
                <input
                    ref={inputRef}
                    id="cover_image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleChange}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                />
            </div>

            {displayedImageUrl && (
                <div className="overflow-hidden rounded-md border border-border">
                    <img
                        src={displayedImageUrl}
                        alt="Cover preview"
                        className="h-48 w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}
