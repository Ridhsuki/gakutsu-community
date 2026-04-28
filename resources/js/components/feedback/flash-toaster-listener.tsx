import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import type { FlashMessages, SharedPageProps } from '@/types/shared';

function getMessage(value: unknown): string | null {
    return typeof value === 'string' && value.trim() !== '' ? value : null;
}

export default function FlashToasterListener() {
    const { props } = usePage<SharedPageProps>();
    const flash = props.flash;
    const lastFlashRef = useRef<FlashMessages | undefined>(undefined);

    useEffect(() => {
        if (!flash) {
            return;
        }

        if (lastFlashRef.current === flash) {
            return;
        }

        lastFlashRef.current = flash;

        const success = getMessage(flash.success);
        const error = getMessage(flash.error);
        const warning = getMessage(flash.warning);
        const info = getMessage(flash.info);
        const status = getMessage(flash.status);

        if (success) {
            toast.success(success);
        }

        if (error) {
            toast.error(error);
        }

        if (warning) {
            toast.warning(warning);
        }

        if (info) {
            toast.info(info);
        }

        if (!success && status) {
            toast.success(status);
        }
    }, [flash]);

    return null;
}
