"use client";

import DisplayCards from "@/components/ui/display-cards";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DisplayCardsSection() {
    const t = useTranslations('DisplayCards');

    const defaultCards = [
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: t('featured.title'),
            description: t('featured.description'),
            date: t('featured.date'),
            iconClassName: "text-blue-500",
            titleClassName: "text-blue-500",
            className:
                "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: t('popular.title'),
            description: t('popular.description'),
            date: t('popular.date'),
            iconClassName: "text-blue-500",
            titleClassName: "text-blue-500",
            className:
                "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: t('new.title'),
            description: t('new.description'),
            date: t('new.date'),
            iconClassName: "text-blue-500",
            titleClassName: "text-blue-500",
            className:
                "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
        },
    ];

    return (
        <section className="flex min-h-[400px] w-full items-center justify-center py-20 bg-white">
            <div className="w-full max-w-3xl">
                <DisplayCards cards={defaultCards} />
            </div>
        </section>
    );
}
