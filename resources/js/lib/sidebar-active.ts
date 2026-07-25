export function isNavActive(currentUrl: string, patterns: string[]): boolean {
    const pathname = currentUrl.split('?')[0];

    return patterns.some((pattern) => {
        if (pathname === pattern) {
            return true;
        }

        return pathname.startsWith(`${pattern}/`);
    });
}
