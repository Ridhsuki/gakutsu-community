import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { EVENT_REGISTRATION_QUESTION_TYPE_OPTIONS } from '@/features/events/constants';

interface QuestionFormLike {
    data: {
        label: string;
        type: string;
        options_text: string;
        placeholder: string;
        help_text: string;
        is_required: boolean;
        is_active: boolean;
        sort_order: string;
    };
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
}

export default function EventRegistrationQuestionFormFields({
    form,
}: {
    form: QuestionFormLike;
}) {
    const isSelect = form.data.type === 'select';

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Question Label</label>
                <Input
                    value={form.data.label}
                    onChange={(e) =>
                        form.setData('label', e.currentTarget.value)
                    }
                />
                {form.errors.label ? (
                    <p className="text-sm text-red-600">{form.errors.label}</p>
                ) : null}
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                    value={form.data.type}
                    onValueChange={(value) => form.setData('type', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {EVENT_REGISTRATION_QUESTION_TYPE_OPTIONS.map(
                            (option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
                {form.errors.type ? (
                    <p className="text-sm text-red-600">{form.errors.type}</p>
                ) : null}
            </div>

            {isSelect ? (
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Options</label>
                    <textarea
                        value={form.data.options_text}
                        onChange={(e) =>
                            form.setData('options_text', e.currentTarget.value)
                        }
                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder={'One option per line\nOption A\nOption B'}
                    />
                    <p className="text-xs text-muted-foreground">
                        One option per line.
                    </p>
                    {form.errors.options_text ? (
                        <p className="text-sm text-red-600">
                            {form.errors.options_text}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className="grid gap-2">
                <label className="text-sm font-medium">Placeholder</label>
                <Input
                    value={form.data.placeholder}
                    onChange={(e) =>
                        form.setData('placeholder', e.currentTarget.value)
                    }
                />
                {form.errors.placeholder ? (
                    <p className="text-sm text-red-600">
                        {form.errors.placeholder}
                    </p>
                ) : null}
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Help Text</label>
                <textarea
                    value={form.data.help_text}
                    onChange={(e) =>
                        form.setData('help_text', e.currentTarget.value)
                    }
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {form.errors.help_text ? (
                    <p className="text-sm text-red-600">
                        {form.errors.help_text}
                    </p>
                ) : null}
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input
                    type="number"
                    min="1"
                    value={form.data.sort_order}
                    onChange={(e) =>
                        form.setData('sort_order', e.currentTarget.value)
                    }
                />
                {form.errors.sort_order ? (
                    <p className="text-sm text-red-600">
                        {form.errors.sort_order}
                    </p>
                ) : null}
            </div>

            <div className="grid gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                        checked={form.data.is_required}
                        onCheckedChange={(checked) =>
                            form.setData('is_required', Boolean(checked))
                        }
                    />
                    Required
                </label>

                <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', Boolean(checked))
                        }
                    />
                    Active
                </label>
            </div>
        </div>
    );
}
