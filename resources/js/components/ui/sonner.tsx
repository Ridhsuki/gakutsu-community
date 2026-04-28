import { Toaster as Sonner, type ToasterProps, toast } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

function Toaster(props: ToasterProps) {
    const { resolvedAppearance } = useAppearance();

    return (
        <Sonner
            theme={resolvedAppearance}
            position="top-right"
            richColors
            closeButton
            expand={false}
            visibleToasts={4}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: [
                        'group toast',
                        'group-[.toaster]:border-border',
                        'group-[.toaster]:bg-background',
                        'group-[.toaster]:text-foreground',
                        'group-[.toaster]:shadow-lg',
                    ].join(' '),
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            {...props}
        />
    );
}

export { Toaster, toast };
