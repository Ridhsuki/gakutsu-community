import {
    addMonths,
    format,
    getMonth,
    getYear,
    setMonth,
    setYear,
} from 'date-fns';
import {
    CalendarIcon,
    ChevronDownIcon,
    ChevronLeft,
    ChevronRight,
    Clock3,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function toDate(value: string) {
    if (!value) {
return undefined;
}

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toDateTimeLocalString(date: Date | undefined) {
    if (!date) {
return '';
}

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const ii = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${ii}`;
}

export default function DateTimePickerField({
    value,
    onChange,
    placeholder = 'Pick date & time',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);

    const selectedDate = useMemo(() => toDate(value), [value]);
    const initialViewDate = selectedDate ?? new Date();
    const [displayMonth, setDisplayMonth] = useState<Date>(initialViewDate);

    useEffect(() => {
        if (open) {
            setDisplayMonth(selectedDate ?? new Date());
        }
    }, [open, selectedDate]);

    const selectedHour = selectedDate ? format(selectedDate, 'HH') : '09';
    const selectedMinute = selectedDate ? format(selectedDate, 'mm') : '00';

    const yearOptions = useMemo(() => {
        const baseYear = getYear(displayMonth);

        return Array.from({ length: 16 }, (_, i) => baseYear - 5 + i);
    }, [displayMonth]);

    const updateDatePart = (date?: Date) => {
        if (!date) {
return;
}

        const base = selectedDate ? new Date(selectedDate) : new Date();

        date.setHours(base.getHours(), base.getMinutes(), 0, 0);

        onChange(toDateTimeLocalString(date));
    };

    const updateTimePart = (nextHour?: string, nextMinute?: string) => {
        const base = selectedDate ? new Date(selectedDate) : new Date();

        const hour = Number(nextHour ?? selectedHour);
        const minute = Number(nextMinute ?? selectedMinute);

        base.setHours(hour, minute, 0, 0);

        onChange(toDateTimeLocalString(base));
    };

    const clearValue = () => {
        onChange('');
        setOpen(false);
    };

    const handleMonthChange = (monthValue: string) => {
        setDisplayMonth(setMonth(displayMonth, Number(monthValue)));
    };

    const handleYearChange = (yearValue: string) => {
        setDisplayMonth(setYear(displayMonth, Number(yearValue)));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    data-empty={!selectedDate}
                    className={cn(
                        'group h-10 w-full justify-between rounded-lg px-3 text-left font-normal shadow-none transition-colors',
                        'data-[empty=true]:text-muted-foreground'
                    )}
                >
                    <span className="inline-flex min-w-0 items-center gap-2 truncate">
                        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                            {selectedDate
                                ? format(selectedDate, 'dd MMM yyyy, HH:mm')
                                : placeholder}
                        </span>
                    </span>

                    <ChevronDownIcon
                        className={cn(
                            'h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
                            open && 'rotate-180'
                        )}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={6}
                className={cn(
                    'w-[300px] rounded-xl border bg-popover p-0 shadow-lg',
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1'
                )}
            >
                <div className="border-b border-border px-2.5 py-2">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={() => setDisplayMonth(addMonths(displayMonth, -1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="grid grid-cols-[1fr_92px] gap-2">
                            <Select
                                value={String(getMonth(displayMonth))}
                                onValueChange={handleMonthChange}
                            >
                                <SelectTrigger className="h-8 rounded-md text-sm">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((month, index) => (
                                        <SelectItem key={month} value={String(index)}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={String(getYear(displayMonth))}
                                onValueChange={handleYearChange}
                            >
                                <SelectTrigger className="h-8 rounded-md text-sm">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-2">
                    <Calendar
                        mode="single"
                        month={displayMonth}
                        onMonthChange={setDisplayMonth}
                        selected={selectedDate}
                        onSelect={updateDatePart}
                        initialFocus
                        classNames={{
                            caption: 'hidden',
                            nav: 'hidden',
                        }}
                    />
                </div>

                <div className="border-t border-border px-3 py-2.5">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>Time</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <Select
                            value={selectedHour}
                            onValueChange={(hour) => updateTimePart(hour, undefined)}
                            disabled={!selectedDate}
                        >
                            <SelectTrigger className="h-8 rounded-md text-sm">
                                <SelectValue placeholder="HH" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                                {HOURS.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                        {hour}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="text-center text-sm font-medium text-muted-foreground">
                            :
                        </div>

                        <Select
                            value={selectedMinute}
                            onValueChange={(minute) => updateTimePart(undefined, minute)}
                            disabled={!selectedDate}
                        >
                            <SelectTrigger className="h-8 rounded-md text-sm">
                                <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                                {MINUTES.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                        {minute}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted/20 px-2.5 py-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearValue}
                        disabled={!selectedDate}
                        className="h-8 px-2.5"
                    >
                        Clear
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="h-8 px-3"
                    >
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
