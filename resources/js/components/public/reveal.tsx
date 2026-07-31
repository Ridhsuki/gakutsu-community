import { useEffect, useRef, useState } from 'react';
import type {CSSProperties, HTMLAttributes, PropsWithChildren} from 'react';
import { cn } from '@/lib/utils';

type RevealProps = PropsWithChildren<
    HTMLAttributes<HTMLDivElement> & {
        delay?: number;
        duration?: number;
        distance?: number;
        blur?: number;
        scale?: number;
        once?: boolean;
        threshold?: number;
        initialInView?: boolean;
    }
>;

export default function Reveal({
    children,
    className,
    delay = 0,
    duration = 700,
    distance = 18,
    blur = 10,
    scale = 0.985,
    once = true,
    threshold = 0.18,
    initialInView = false,
    ...props
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(initialInView);

    useEffect(() => {
        if (typeof window === 'undefined') {
return;
}

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsVisible(true);

            return;
        }

        const element = ref.current;

        if (!element) {
return;
}

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -8% 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [once, threshold]);

    const style = {
        '--reveal-delay': `${delay}ms`,
        '--reveal-duration': `${duration}ms`,
        '--reveal-distance': `${distance}px`,
        '--reveal-blur': `${blur}px`,
        '--reveal-scale': `${scale}`,
    } as CSSProperties;

    return (
        <div
            ref={ref}
            style={style}
            className={cn(
                'reveal-base',
                isVisible ? 'reveal-visible' : 'reveal-hidden',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
