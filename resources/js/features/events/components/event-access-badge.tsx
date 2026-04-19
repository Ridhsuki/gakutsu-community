import { Badge } from '@/components/ui/badge';
import type { EventAccessType } from '@/features/events/types';

export default function EventAccessBadge({
    accessType,
}: {
    accessType: EventAccessType;
}) {
    const config =
        accessType === 'free'
            ? {
                  label: 'Free',
                  className: [
                      'inline-flex items-center px-2.5 py-0.5',
                      'text-[11px] font-medium tracking-wide',
                      'rounded-full border',
                      'bg-teal-500/10 border-teal-500/20 text-teal-500',
                      'backdrop-blur-sm',
                      'dark:bg-teal-500/10 dark:border-teal-400/20 dark:text-teal-400',
                  ].join(' '),
              }
            : {
                  label: 'Paid',
                  className: [
                      'inline-flex items-center px-2.5 py-0.5',
                      'text-[11px] font-medium tracking-wide',
                      'rounded-full border',
                      'bg-violet-500/10 border-violet-500/20 text-violet-500',
                      'backdrop-blur-sm',
                      'dark:bg-violet-500/10 dark:border-violet-400/20 dark:text-violet-400',
                  ].join(' '),
              };

    return <Badge className={config.className}>{config.label}</Badge>;
}
