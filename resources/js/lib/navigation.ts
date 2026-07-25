export function appendFrom(path: string, currentUrl: string): string {
    const [pathname, search = ''] = currentUrl.split('?');
    const params = new URLSearchParams(search);

    const from = pathname + (search ? `?${search}` : '');
    params.set('from', from);

    const separator = path.includes('?') ? '&' : '?';

    return `${path}${separator}${params.toString()}`;
}

export function resolveBackHref(currentUrl: string, fallbackHref: string): string {
    const [, search = ''] = currentUrl.split('?');
    const params = new URLSearchParams(search);
    const from = params.get('from');

    if (!from || !from.startsWith('/')) {
        return fallbackHref;
    }

    return from;
}
