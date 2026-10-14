"use client";

import { useState } from "react";
import { type SocialLinks } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
  Gamepad2,
  MessageSquare,
} from "lucide-react";

interface ContactSectionProps {
  socialLinks?: SocialLinks;
  email?: string;
}

export function ContactSection({ socialLinks, email }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: contactEmail,
          message,
          honeypot,
        }),
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        setErrorMessage(res.error || "Failed to send message. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setName("");
      setContactEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const directEmail = email || "ramadanrahmad1910@gmail.com";

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in Touch
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg">
            Whether you have a job opportunity, a project proposal, or just want to discuss tech, feel free to drop a message!
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            {isSuccess ? (
              <div className="py-10 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your message has landed directly in Rahmad's inbox. I will reply to you as soon as possible.
                </p>
                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSuccess(false)}
                    className="text-xs"
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from real users, traps bots) */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Hello Rahmad, I came across your portfolio and would like to talk about..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="glow"
                  className="w-full h-11 gap-2 text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Right Social & Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Direct Contact
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Email
                    </span>
                    <a
                      href={`mailto:${directEmail}`}
                      className="text-xs font-medium text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                    >
                      {directEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Response Time
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      Usually within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                Social Profiles
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all flex items-center gap-2.5 shadow-sm"
                  >
                    <Github className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="font-medium">GitHub</span>
                  </a>
                )}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all flex items-center gap-2.5 shadow-sm"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="font-medium">LinkedIn</span>
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all flex items-center gap-2.5 shadow-sm"
                  >
                    <Instagram className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                    <span className="font-medium">Instagram</span>
                  </a>
                )}
                {socialLinks?.itch_io && (
                  <a
                    href={socialLinks.itch_io}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all flex items-center gap-2.5 shadow-sm"
                  >
                    <Gamepad2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    <span className="font-medium">itch.io</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
