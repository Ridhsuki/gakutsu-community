/**
 * Formats a document title idempotently.
 * Appends ' - appName' if not already present as the exact suffix.
 */
export function formatDocumentTitle(title: string, appName: string): string {
    const trimmedTitle = (title ?? '').trim();
    const trimmedAppName = (appName ?? '').trim();

    if (!trimmedTitle || trimmedTitle === trimmedAppName) {
        return trimmedAppName;
    }

    const suffix = ` - ${trimmedAppName}`;

    if (trimmedTitle.endsWith(suffix)) {
        return trimmedTitle;
    }

    return `${trimmedTitle}${suffix}`;
}
