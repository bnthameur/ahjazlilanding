"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";

interface InquiryFormProps {
    venueId: string;
    venueTitle: string;
    compact?: boolean;
}

const COOLDOWN_MS = 60_000; // 60 seconds client-side cooldown

export default function InquiryForm({ venueId, venueTitle, compact }: InquiryFormProps) {
    const t = useTranslations("VenueDetails");
    const formRef = useRef<HTMLFormElement>(null);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // On mount, restore cooldown from sessionStorage (survives page refreshes within
    // the same browser tab/session, but resets when the tab is closed).
    useEffect(() => {
        const storageKey = `inquiryCooldown:${venueId}`;
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
            const value = parseInt(stored, 10);
            if (!Number.isNaN(value) && value > Date.now()) {
                setCooldownUntil(value);
            } else {
                // Expired – clean up
                sessionStorage.removeItem(storageKey);
            }
        }
    }, [venueId]);

    // Countdown ticker
    useEffect(() => {
        if (!cooldownUntil) return;

        const update = () => {
            const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setCooldownUntil(null);
                setSecondsLeft(0);
                sessionStorage.removeItem(`inquiryCooldown:${venueId}`);
            } else {
                setSecondsLeft(remaining);
            }
        };

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [cooldownUntil, venueId]);

    // Auto-dismiss success banner after 10 seconds
    useEffect(() => {
        if (!success) return;
        const id = setTimeout(() => setSuccess(false), 10_000);
        return () => clearTimeout(id);
    }, [success]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Prevent double submission if already loading
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        // Honeypot anti-spam check
        const honeypot = formData.get("company");
        if (honeypot) {
            setLoading(false);
            setError(t("inquiry_error"));
            return;
        }

        // Client-side cooldown check
        if (cooldownUntil && cooldownUntil > Date.now()) {
            setLoading(false);
            setError(t("inquiry_rate_limit", { seconds: secondsLeft }));
            return;
        }

        const guestsRaw = formData.get("guests") as string | null;

        const payload = {
            venue_id: venueId,
            customer_name: (formData.get("name") as string | null)?.trim() ?? "",
            customer_email: (formData.get("email") as string | null)?.trim() ?? "",
            customer_phone: (formData.get("phone") as string | null)?.trim() ?? "",
            message: (formData.get("message") as string | null)?.trim() ?? "",
            event_date: (formData.get("date") as string | null) || null,
            guest_count: guestsRaw ? parseInt(guestsRaw, 10) : null,
            event_type: "inquiry",
        };

        try {
            const response = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setError(t("inquiry_rate_limit_server"));
                } else if (response.status === 409) {
                    setError(t("inquiry_duplicate"));
                } else {
                    setError(result.error ?? t("inquiry_error"));
                }
            } else {
                setSuccess(true);
                setError("");
                // Clear the form fields after successful submission
                formRef.current?.reset();

                // Start 60-second cooldown and persist in sessionStorage
                const nextCooldown = Date.now() + COOLDOWN_MS;
                sessionStorage.setItem(`inquiryCooldown:${venueId}`, String(nextCooldown));
                setCooldownUntil(nextCooldown);
            }
        } catch {
            setError(t("inquiry_error"));
        } finally {
            setLoading(false);
        }
    }

    const isCoolingDown = Boolean(cooldownUntil && cooldownUntil > Date.now());
    const isDisabled = loading || isCoolingDown;

    const containerClass = compact
        ? "bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm"
        : "bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm";

    return (
        <div className={containerClass}>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t("send_inquiry")}</h3>
            <p className="text-slate-500 mb-6 text-sm">{t("inquiry_desc")}</p>

            {/* Success banner */}
            {success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3 mb-6">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
                    <div>
                        <p className="font-semibold">{t("inquiry_sent")}</p>
                        <p className="text-sm mt-0.5 text-green-700">{t("inquiry_sent_desc")}</p>
                    </div>
                </div>
            ) : null}

            {/* Error banner */}
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            ) : null}

            {/* Cooldown banner (shown after success, replaces the submit button message) */}
            {isCoolingDown && !success ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg mb-4 text-sm text-center">
                    {t("inquiry_cooldown", { seconds: secondsLeft })}
                </div>
            ) : null}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - hidden from real users */}
                <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                />

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        {t("name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={isDisabled}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                        placeholder={t("name")}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("phone")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            disabled={isDisabled}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder="+213 6 00 00 00 00"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("email")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            disabled={isDisabled}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("event_date")}{" "}
                            <span className="text-slate-400 font-normal">({t("optional")})</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            disabled={isDisabled}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-slate-700 mb-1">
                            {t("guest_count")}{" "}
                            <span className="text-slate-400 font-normal">({t("optional")})</span>
                        </label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            min={1}
                            max={10000}
                            disabled={isDisabled}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder="e.g. 200"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        {t("message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        minLength={10}
                        rows={4}
                        disabled={isDisabled}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400"
                        placeholder={t("message")}
                    />
                </div>

                {/* Anti-spam note */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{t("inquiry_antispam")}</span>
                </div>

                <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {isCoolingDown
                        ? t("inquiry_wait", { seconds: secondsLeft })
                        : loading
                          ? t("inquiry_sending")
                          : t("send")}
                </button>
            </form>
        </div>
    );
}
