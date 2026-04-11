interface EmptyStateRowProps {
    colSpan: number;
    message?: string;
}

export default function EmptyStateRow({
    colSpan,
    message = 'No data found.',
}: EmptyStateRowProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-4 py-8 text-center text-muted-foreground">
                {message}
            </td>
        </tr>
    );
}
