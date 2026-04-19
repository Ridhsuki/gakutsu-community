import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function toDate(value: string) {
    if (!value) return undefined;

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toDateTimeLocalString(date: Date | undefined) {
    if (!date) return '';

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
    const selectedDate = useMemo(() => toDate(value), [value]);

    const handleDateSelect = (date?: Date) => {
        if (!date) return;

        const current = selectedDate ?? new Date();
        date.setHours(current.getHours(), current.getMinutes(), 0, 0);

        onChange(toDateTimeLocalString(date));
    };

    const handleTimeChange = (timeValue: string) => {
        const base = selectedDate ?? new Date();
        const parsedTime = parse(timeValue, 'HH:mm', new Date());

        base.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

        onChange(toDateTimeLocalString(base));
    };

    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 justify-start font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'dd MMM yyyy, HH:mm') : placeholder}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-3">
                    <div className="space-y-3">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                        />

                        <Input
                            type="time"
                            value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                            onChange={(e) => handleTimeChange(e.currentTarget.value)}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
