"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Quote,
  Eye,
  Edit3,
} from "lucide-react";

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  error,
  minHeight = "min-h-[300px]",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const insertSnippet = (before: string, after = "") => {
    const textarea = document.getElementById("md-textarea") as HTMLTextAreaElement;
    if (!textarea) {
      onChange(value + before + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = before + (selectedText || "teks") + after;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selectedText.length || 4)
      );
    }, 50);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">
          {label}
        </label>
        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === "write"
                ? "bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        {/* Toolbar (hanya aktif di tab write) */}
        {activeTab === "write" && (
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/60">
            <button
              type="button"
              onClick={() => insertSnippet("**", "**")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Tebal (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("*", "*")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Miring (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet("## ")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("### ")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet("- ")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Daftar Poin (List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("1. ")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Daftar Nomor"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet("```ts\n", "\n```")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Blok Kode"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("> ")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Kutipan (Blockquote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet("[", "](https://example.com)")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Tautan Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        {activeTab === "write" ? (
          <textarea
            id="md-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# Judul Proyek&#10;&#10;Jelaskan latar belakang, fitur, arsitektur teknis, dan tantangan yang diselesaikan..."
            className={`w-full p-4 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono resize-y ${minHeight}`}
          />
        ) : (
          <div
            className={`p-5 prose prose-invert max-w-none text-slate-200 text-sm overflow-y-auto ${minHeight}`}
          >
            {value.trim() ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-3 mt-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold text-cyan-300 mt-4 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold text-indigo-300 mt-3 mb-1.5">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300">
                      {children}
                    </ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg overflow-x-auto text-xs my-3 text-cyan-300">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-cyan-500 pl-3 italic text-slate-400 my-2">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <span className="text-slate-500 italic text-xs">
                Belum ada konten untuk dipratinjau.
              </span>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
