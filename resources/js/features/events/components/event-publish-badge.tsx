import { Badge } from '@/components/ui/badge';

export default function EventPublishBadge({
    isPublished,
}: {
    isPublished: boolean;
}) {
    const config = isPublished
        ? {
              label: 'Published',
              className: [
                  'inline-flex items-center px-2.5 py-0.5',
                  'text-[11px] font-medium tracking-wide',
                  'rounded-full border',
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
                  'backdrop-blur-sm',
                  'dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-400',
              ].join(' '),
          }
        : {
              label: 'Draft',
              className: [
                  'inline-flex items-center px-2.5 py-0.5',
                  'text-[11px] font-medium tracking-wide',
                  'rounded-full border',
                  'bg-slate-500/10 border-slate-500/20 text-slate-500',
                  'backdrop-blur-sm',
                  'dark:bg-slate-500/10 dark:border-slate-400/20 dark:text-slate-400',
              ].join(' '),
          };

    return <Badge className={config.className}>{config.label}</Badge>;
}
