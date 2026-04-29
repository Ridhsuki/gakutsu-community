import { type ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-2', className)}
            classNames={{
                months: 'flex flex-col gap-2',
                month: 'flex w-full flex-col gap-2',
                caption: 'relative flex h-9 items-center justify-center px-8',
                caption_label:
                    'pointer-events-none relative z-0 inline-flex items-center text-sm font-semibold tracking-tight',
                nav: 'pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between px-1',
                button_previous: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'pointer-events-auto h-7 w-7 rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'pointer-events-auto h-7 w-7 rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                ),
                month_grid: 'w-full border-collapse',
                weekdays: 'mb-1 flex',
                weekday:
                    'flex-1 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground',
                week: 'mt-1 flex w-full justify-between',
                day: 'relative flex h-8 w-8 items-center justify-center p-0 text-center',
                day_button: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-8 w-8 rounded-md border border-transparent p-0 text-sm font-normal transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out hover:border-border/60 hover:bg-accent/70'
                ),
                selected:
                    'border-primary/30 bg-primary/10 text-primary shadow-sm hover:bg-primary/12 hover:text-primary',
                today:
                    'border border-border bg-accent/70 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))]',
                outside: 'text-muted-foreground opacity-35',
                disabled: 'text-muted-foreground opacity-30',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, className, ...props }) =>
                    orientation === 'left' ? (
                        <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
                    ) : (
                        <ChevronRight className={cn('h-4 w-4', className)} {...props} />
                    ),
            }}
            {...props}
        />
    );
}

export { Calendar };
