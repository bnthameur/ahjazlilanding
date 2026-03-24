import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface InquiryPayload {
    venue_id: unknown;
    customer_name: unknown;
    customer_email: unknown;
    customer_phone: unknown;
    message: unknown;
    event_date?: unknown;
    guest_count?: unknown;
    event_type?: unknown;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value: unknown): value is string {
    return typeof value === "string" && UUID_REGEX.test(value);
}

function isNonEmptyString(value: unknown, maxLen = 2000): value is string {
    return typeof value === "string" && value.trim().length > 0 && value.length <= maxLen;
}

export async function POST(request: Request) {
    try {
        const body: InquiryPayload = await request.json();

        // --- Input validation ---
        if (!isValidUuid(body.venue_id)) {
            return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
        }

        if (!isNonEmptyString(body.customer_name, 100) || body.customer_name.trim().length < 2) {
            return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
        }

        if (!isNonEmptyString(body.customer_phone, 20) || body.customer_phone.trim().length < 8) {
            return NextResponse.json({ error: "A valid phone number is required" }, { status: 400 });
        }

        if (!isNonEmptyString(body.message, 2000) || body.message.trim().length < 10) {
            return NextResponse.json(
                { error: "Message must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Optional fields
        const customerEmail =
            typeof body.customer_email === "string" && body.customer_email.trim().length > 0
                ? body.customer_email.trim()
                : null;

        const eventDate =
            typeof body.event_date === "string" && body.event_date.trim().length > 0
                ? body.event_date.trim()
                : null;

        const guestCount =
            typeof body.guest_count === "number" && Number.isFinite(body.guest_count) && body.guest_count > 0
                ? Math.floor(body.guest_count)
                : null;

        const eventType =
            typeof body.event_type === "string" && body.event_type.trim().length > 0
                ? body.event_type.trim().slice(0, 100)
                : "inquiry";

        const customerName = body.customer_name.trim();
        const customerPhone = body.customer_phone.trim();
        const message = body.message.trim();
        const venueId = body.venue_id;

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Verify the venue exists and is publicly accessible
        const { data: venue, error: venueError } = await supabase
            .from("venues")
            .select("id, status")
            .eq("id", venueId)
            .maybeSingle();

        if (venueError || !venue) {
            return NextResponse.json({ error: "Venue not found" }, { status: 404 });
        }

        if (venue.status !== "approved" && venue.status !== "published") {
            return NextResponse.json(
                { error: "This venue is not accepting inquiries at this time" },
                { status: 403 }
            );
        }

        // Insert the inquiry - populate both column sets to stay compatible with
        // both the legacy (name/email/phone) and primary (customer_*) column naming
        const { error: insertError } = await supabase.from("inquiries").insert({
            venue_id: venueId,
            customer_name: customerName,
            customer_phone: customerPhone,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            message,
            event_date: eventDate,
            guest_count: guestCount,
            event_type: eventType,
            status: "new",
        });

        if (insertError) {
            console.error("[POST /api/inquiries] DB insert error:", insertError.message);
            return NextResponse.json(
                { error: "Failed to submit inquiry. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Inquiry submitted successfully" },
            { status: 201 }
        );
    } catch (err) {
        console.error("[POST /api/inquiries] Unexpected error:", err);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}
