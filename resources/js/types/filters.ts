export type SortDirection = 'asc' | 'desc';

export interface IndexFilters<TSortField extends string = string> {
    search?: string;
    sort_field?: TSortField;
    sort_direction?: SortDirection;
}
