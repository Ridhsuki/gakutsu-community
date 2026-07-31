import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading1,
    Heading2,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import BlogEditorLinkDialog from '@/features/blogs/components/blog-editor-link-dialog';

interface BlogPostEditorProps {
    value: string;
    onChange: (value: string) => void;
    onUploadImage?: (file: File) => Promise<string>;
    placeholder?: string;
}

export default function BlogPostEditor({
    value,
    onChange,
    onUploadImage,
    placeholder = 'Write your blog content here...',
}: BlogPostEditorProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [currentLink, setCurrentLink] = useState('');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                protocols: ['http', 'https'],
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class:
                    'tiptap-editor min-h-[260px] w-full rounded-b-md border-x border-b border-border bg-background px-4 py-3 text-sm text-foreground outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
return;
}

        const current = editor.getHTML();

        if (value !== current) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [editor, value]);

    const openLinkDialog = () => {
        if (!editor) {
return;
}

        const previousUrl = editor.getAttributes('link').href || '';
        setCurrentLink(previousUrl);
        setIsLinkDialogOpen(true);
    };

    const handleSaveLink = (url: string) => {
        if (!editor) {
return;
}

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleRemoveLink = () => {
        if (!editor) {
return;
}

        editor.chain().focus().extendMarkRange('link').unsetLink().run();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !editor || !onUploadImage) {
            event.target.value = '';

            return;
        }

        setUploadError(null);
        setIsUploadingImage(true);

        try {
            const imageUrl = await onUploadImage(file);
            editor.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error) {
            console.error(error);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to upload image.';

            setUploadError(message);
        } finally {
            setIsUploadingImage(false);
            event.target.value = '';
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <>
            <div className="rounded-md border border-border">
                <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 p-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
                    >
                        <Heading1 className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-accent' : ''}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-accent' : ''}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                    >
                        <List className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'bg-accent' : ''}
                    >
                        <Quote className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={openLinkDialog}
                        className={editor.isActive('link') ? 'bg-accent' : ''}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>

                    {onUploadImage ? (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                            >
                                <ImagePlus className="h-4 w-4" />
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </>
                    ) : null}

                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().chain().focus().undo().run()}
                        >
                            <Undo2 className="h-4 w-4" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().chain().focus().redo().run()}
                        >
                            <Redo2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {uploadError ? (
                    <div className="border-b border-border bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {uploadError}
                    </div>
                ) : null}

                <EditorContent editor={editor} />
            </div>

            <BlogEditorLinkDialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}
                initialUrl={currentLink}
                onSubmit={handleSaveLink}
                onRemove={editor.isActive('link') ? handleRemoveLink : undefined}
            />
        </>

    );
}
