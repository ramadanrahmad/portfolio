import { NextResponse } from "next/server";
import { recordAnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, path, projectSlug, title } = body;

    if (!eventType || !path) {
      return NextResponse.json(
        { success: false, error: "Missing eventType or path" },
        { status: 400 }
      );
    }

    // Hindari mencatat kunjungan dari dashboard admin sendiri
    if (typeof path === "string" && path.startsWith("/admin")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const result = await recordAnalyticsEvent({
      eventType: eventType as AnalyticsEventType,
      path,
      projectSlug,
      title,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
