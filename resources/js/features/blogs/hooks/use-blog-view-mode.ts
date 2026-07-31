import { useState } from 'react';
import type { BlogManagementViewMode } from '@/features/blogs/types';

const STORAGE_KEY = 'yokpelajarin.blog-management.view-mode';

function isValidViewMode(
    value: string | null,
): value is BlogManagementViewMode {
    return value === 'table' || value === 'cards';
}

function getInitialViewMode(
    defaultValue: BlogManagementViewMode,
): BlogManagementViewMode {
    if (typeof window === 'undefined') {
        return defaultValue;
    }

    const savedValue = window.localStorage.getItem(STORAGE_KEY);

    return isValidViewMode(savedValue) ? savedValue : defaultValue;
}

export default function useBlogViewMode(
    defaultValue: BlogManagementViewMode = 'table',
) {
    const [viewMode, setViewModeState] = useState<BlogManagementViewMode>(() =>
        getInitialViewMode(defaultValue),
    );

    const setViewMode = (nextViewMode: BlogManagementViewMode) => {
        setViewModeState(nextViewMode);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, nextViewMode);
        }
    };

    return {
        viewMode,
        setViewMode,
    };
}
