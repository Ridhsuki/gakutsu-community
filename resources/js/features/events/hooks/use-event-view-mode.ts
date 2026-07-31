import { useState } from 'react';
import type { EventManagementViewMode } from '@/features/events/types';

const STORAGE_KEY = 'yokpelajarin.event-management.view-mode';

function isValidViewMode(
    value: string | null,
): value is EventManagementViewMode {
    return value === 'table' || value === 'cards';
}

function getInitialViewMode(
    defaultValue: EventManagementViewMode,
): EventManagementViewMode {
    if (typeof window === 'undefined') {
        return defaultValue;
    }

    const savedValue = window.localStorage.getItem(STORAGE_KEY);

    return isValidViewMode(savedValue) ? savedValue : defaultValue;
}

export default function useEventViewMode(
    defaultValue: EventManagementViewMode = 'table',
) {
    const [viewMode, setViewModeState] = useState<EventManagementViewMode>(() =>
        getInitialViewMode(defaultValue),
    );

    const setViewMode = (nextViewMode: EventManagementViewMode) => {
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
