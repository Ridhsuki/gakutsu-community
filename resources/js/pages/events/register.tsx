import { Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SeoHead from '@/components/public/seo-head';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type EventQuestion = {
    id: number;
    label: string;
    type: 'short_text' | 'long_text' | 'select';
    options?: string[] | null;
    placeholder?: string | null;
    help_text?: string | null;
    is_required: boolean;
};

type EventItem = {
    id: number;
    slug: string;
    title: string;
    category: string;
    mentor?: {
        name: string;
    } | null;
};

export default function EventRegister({
    event,
    questions,
    alreadyRegistered,
}: {
    event: EventItem;
    questions: EventQuestion[];
    alreadyRegistered: boolean;
}) {
    const initialAnswers = questions.reduce<Record<string, string>>((carry, item) => {
        carry[String(item.id)] = '';
        return carry;
    }, {});

    const form = useForm({
        answers: initialAnswers,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(`/events/${event.id}/registrations`, {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <SeoHead
                title={`Daftar Event - ${event.title}`}
                description={`Jawab pertanyaan registrasi dan daftar ke event ${event.title} di Yok Pelajarin.`}
            />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <Link href={`/events/${event.slug}`} className="inline-flex text-sm font-medium text-primary">
                    ← Kembali ke detail event
                </Link>

                <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">Registrasi Event</p>
                        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Mentor: {event.mentor?.name ?? '-'} · {event.category}
                        </p>
                    </div>

                    {alreadyRegistered ? (
                        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5 text-primary">
                            Anda sudah terdaftar pada event ini.
                        </div>
                    ) : (
                        <form onSubmit={submit} className="mt-8 space-y-6">
                            {questions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                                    Event ini tidak memiliki pertanyaan tambahan. Klik tombol di bawah untuk menyelesaikan registrasi.
                                </div>
                            ) : (
                                questions.map((question) => (
                                    <div key={question.id} className="space-y-2">
                                        <label className="text-sm font-medium">
                                            {question.label}
                                            {question.is_required ? (
                                                <span className="ml-1 text-red-500">*</span>
                                            ) : null}
                                        </label>

                                        {question.help_text ? (
                                            <p className="text-xs text-muted-foreground">
                                                {question.help_text}
                                            </p>
                                        ) : null}

                                        {question.type === 'short_text' ? (
                                            <Input
                                                value={form.data.answers[String(question.id)]}
                                                onChange={(e) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: e.currentTarget.value,
                                                    })
                                                }
                                                placeholder={question.placeholder ?? ''}
                                                className="h-10"
                                            />
                                        ) : null}

                                        {question.type === 'long_text' ? (
                                            <Textarea
                                                value={form.data.answers[String(question.id)]}
                                                onChange={(e) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: e.currentTarget.value,
                                                    })
                                                }
                                                placeholder={question.placeholder ?? ''}
                                                className="min-h-32 resize-y"
                                            />
                                        ) : null}

                                        {question.type === 'select' ? (
                                            <Select
                                                value={form.data.answers[String(question.id)]}
                                                onValueChange={(value) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Pilih jawaban" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(question.options ?? []).map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : null}

                                        {form.errors[`answers.${question.id}`] ? (
                                            <p className="text-sm text-red-500">
                                                {form.errors[`answers.${question.id}`]}
                                            </p>
                                        ) : null}
                                    </div>
                                ))
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Mengirim...' : 'Kirim Jawaban & Daftar'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/events/${event.slug}`}>Batal</Link>
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
