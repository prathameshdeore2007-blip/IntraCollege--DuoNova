import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
}

const CursorAI = () => {
  const navigate = useNavigate();
  const playClickSound = useClickSound();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const username = useMemo(() => {
    const email = localStorage.getItem("userEmail") || "student@example.com";
    const base = email.split("@")[0] || "Student";
    return base.charAt(0).toUpperCase() + base.slice(1);
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "ai",
        text: `Hello ${username}! I am your IntraCollege AI Assistant, here to help you navigate your academic journey.`,
      },
    ]);
  }, [username]);

  useEffect(() => {
    // Auto-scroll to the latest message
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    playClickSound();

    const newUserMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, newUserMsg]);
    setInput("");

    // Simulate AI typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const response: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        text: "Thanks for your message! This is a demo response. In production, this will connect to the IntraCollege AI backend to provide rich, contextual answers.",
      };
      setMessages((m) => [...m, response]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Subtle geometric pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
        backgroundImage:
          "radial-gradient(1px 1px at 20px 20px, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(1px 1px at 60px 60px, rgba(255,255,255,0.35) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <button
            onClick={() => {
              playClickSound();
              navigate(-1);
            }}
            className="group flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="select-none text-center text-lg font-semibold tracking-wide text-white">
            Ask AI
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Chat container */}
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        {/* AI Branding */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-30 bg-primary/40 rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/40 bg-slate-800/60 shadow-xl">
              <Bot className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="rounded-2xl border-2 border-white/10 bg-slate-900/50 shadow-2xl">
          <div ref={listRef} className="h-[56vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed ${
                    m.role === "ai"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-slate-800 text-slate-100 border border-white/10"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-primary/80">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                <span className="ml-2 text-xs">IntraCollege AI is typing...</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-3 border-t-2 border-white/10 bg-slate-900/60 px-3 py-3 sm:px-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your studies..."
              className="flex-1 rounded-xl border-2 border-white/10 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-primary/60"
            />
            <button
              onClick={sendMessage}
              className="group inline-flex items-center justify-center rounded-xl border-2 border-primary/40 bg-primary/20 px-4 py-3 text-primary transition-all hover:bg-primary/30 hover:shadow-lg disabled:opacity-50"
              aria-label="Send message"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CursorAI;



