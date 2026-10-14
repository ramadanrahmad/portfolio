import { createClient } from "@/lib/supabase/server";
import { type Message } from "@/types";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const metadata = {
  title: "Pesan Masuk | Admin Portal",
};

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messagesData } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (messagesData ?? []) as Message[];

  return (
    <div>
      <MessagesManager initialMessages={messages} />
    </div>
  );
}
