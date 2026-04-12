import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface BlogEditorLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialUrl?: string;
    onSubmit: (url: string) => void;
    onRemove?: () => void;
}

export default function BlogEditorLinkDialog({
    open,
    onOpenChange,
    initialUrl = '',
    onSubmit,
    onRemove,
}: BlogEditorLinkDialogProps) {
    const [url, setUrl] = useState(initialUrl);

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl, open]);

    const handleSave = () => {
        onSubmit(url.trim());
        onOpenChange(false);
    };

    const handleRemove = () => {
        onRemove?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <label htmlFor="editor-link-url" className="block text-sm font-medium">
                        URL
                    </label>
                    <input
                        id="editor-link-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.currentTarget.value)}
                        placeholder="https://example.com"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {onRemove ? (
                        <Button type="button" variant="outline" onClick={handleRemove}>
                            Remove Link
                        </Button>
                    ) : null}

                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                        onClick={handleSave}
                    >
                        Save Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
