'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = useMemo(() => searchParams?.toString() ?? '', [searchParams]);
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let t1: ReturnType<typeof setTimeout> | null = null;
        let t2: ReturnType<typeof setTimeout> | null = null;
        let t3: ReturnType<typeof setTimeout> | null = null;

        setVisible(true);
        setProgress(20);

        t1 = setTimeout(() => setProgress(60), 120);
        t2 = setTimeout(() => setProgress(85), 240);
        t3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 180);
        }, 380);

        return () => {
            if (t1) clearTimeout(t1);
            if (t2) clearTimeout(t2);
            if (t3) clearTimeout(t3);
        };
    }, [pathname, search]);

    return (
        <div
            aria-hidden={!visible}
            className={`fixed left-0 right-0 top-0 z-[9999] h-1 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.45)] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
