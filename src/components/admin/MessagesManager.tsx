"use client";

import { useState } from "react";
import { type Message } from "@/types";
import {
  toggleMessageRead,
  deleteMessage,
} from "@/app/admin/messages/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  Search,
  Calendar,
  Reply,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface MessagesManagerProps {
  initialMessages: Message[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: nextRead } : m))
    );
    if (activeMessage && activeMessage.id === id) {
      setActiveMessage({ ...activeMessage, is_read: nextRead });
    }
    await toggleMessageRead(id, nextRead);
  };

  const handleOpenMessage = async (msg: Message) => {
    setActiveMessage(msg);
    // Jika belum dibaca, otomatis tandai dibaca
    if (!msg.is_read) {
      handleToggleRead(msg.id, false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    await deleteMessage(deletingId);
    setMessages((prev) => prev.filter((m) => m.id !== deletingId));
    if (activeMessage && activeMessage.id === deletingId) {
      setActiveMessage(null);
    }
    setIsDeleting(false);
    setDeletingId(null);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages.filter((m) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query);

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
        ? !m.is_read
        : m.is_read;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-cyan-400" />
            Kotak Masuk Pesan Kontak
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {messages.length} pesan masuk ({unreadCount} belum dibaca).
          </p>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Cari pengirim, email, atau isi pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-slate-950/80 border-slate-800 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "Semua", count: messages.length },
            { id: "unread", label: "Belum Dibaca", count: unreadCount },
            { id: "read", label: "Sudah Dibaca", count: messages.length - unreadCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab.id
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span> ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Pesan */}
      {filteredMessages.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-slate-800">
          <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Tidak ada pesan
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Semua pesan dari formulir kontak publik akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`glass-card rounded-xl p-4 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                !msg.is_read
                  ? "border-cyan-500/40 bg-cyan-950/10 hover:border-cyan-500/60"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    !msg.is_read
                      ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  {!msg.is_read ? (
                    <Mail className="w-4 h-4 animate-pulse" />
                  ) : (
                    <MailOpen className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {msg.name}
                    </h3>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-mono text-cyan-400 block truncate">
                    {msg.email}
                  </span>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Tanggal & Aksi Cepat */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.is_read)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    title={msg.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  >
                    {msg.is_read ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeletingId(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Hapus pesan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Pesan */}
      <Dialog open={!!activeMessage} onOpenChange={(open) => !open && setActiveMessage(null)}>
        <DialogContent onClose={() => setActiveMessage(null)}>
          <DialogHeader>
            <DialogTitle>Pesan dari {activeMessage?.name}</DialogTitle>
            <DialogDescription className="space-y-1">
              <span className="block text-cyan-400 font-mono">
                {activeMessage?.email}
              </span>
              <span className="block text-[11px] text-slate-500">
                Diterima pada:{" "}
                {activeMessage &&
                  new Date(activeMessage.created_at).toLocaleString("id-ID")}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {activeMessage?.message}
          </div>

          <DialogFooter>
            {activeMessage && (
              <a
                href={`mailto:${activeMessage.email}?subject=Balasan: Portofolio Rahmad Ramadan`}
                className="w-full sm:w-auto"
              >
                <Button variant="glow" size="sm" className="w-full gap-2 text-xs">
                  <Reply className="w-3.5 h-3.5" />
                  <span>Balas lewat Email</span>
                </Button>
              </a>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveMessage(null)}
              className="text-xs"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent onClose={() => setDeletingId(null)}>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pesan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pesan ini secara permanen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeletingId(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
