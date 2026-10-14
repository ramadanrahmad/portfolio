import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validasi Zod (termasuk verifikasi honeypot anti-spam)
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    // 2. Simpan pesan ke tabel messages di Supabase
    const supabase = await createClient();
    const { error: insertError } = await supabase.from("messages").insert([
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        is_read: false,
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
