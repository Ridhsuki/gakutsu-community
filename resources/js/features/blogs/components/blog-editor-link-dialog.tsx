import { useState } from 'react';
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

function BlogEditorLinkDialogContent({
    initialUrl,
    onSubmit,
    onRemove,
    onCancel,
}: {
    initialUrl: string;
    onSubmit: (url: string) => void;
    onRemove?: () => void;
    onCancel: () => void;
}) {
    const [url, setUrl] = useState(initialUrl);

    const handleSave = () => {
        onSubmit(url.trim());
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
                <label
                    htmlFor="editor-link-url"
                    className="block text-sm font-medium"
                >
                    URL
                </label>
                <input
                    id="editor-link-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.currentTarget.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
                {onRemove ? (
                    <Button type="button" variant="outline" onClick={onRemove}>
                        Remove Link
                    </Button>
                ) : null}

                <Button type="button" variant="outline" onClick={onCancel}>
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
        </>
    );
}

export default function BlogEditorLinkDialog({
    open,
    onOpenChange,
    initialUrl = '',
    onSubmit,
    onRemove,
}: BlogEditorLinkDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <BlogEditorLinkDialogContent
                    initialUrl={initialUrl}
                    onSubmit={(url) => {
                        onSubmit(url);
                        onOpenChange(false);
                    }}
                    onRemove={
                        onRemove
                            ? () => {
                                  onRemove();
                                  onOpenChange(false);
                              }
                            : undefined
                    }
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
