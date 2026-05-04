import { useState, useRef, useEffect } from "react";
import { usePrototypeStore } from "@/lib/prototype/store";
import { processChatMessage } from "@/lib/prototype/aiChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Undo2, Bot, User } from "lucide-react";

export const ChatPanel = () => {
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const slides = usePrototypeStore((s) => s.slides);
  const chatBySlide = usePrototypeStore((s) => s.chatBySlide);
  const pushChat = usePrototypeStore((s) => s.pushChat);
  const applyEditFromChat = usePrototypeStore((s) => s.applyEditFromChat);
  const undoEdit = usePrototypeStore((s) => s.undoEdit);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = chatBySlide[selectedSlideId] ?? [];
  const slide = slides.find((s) => s.id === selectedSlideId);
  const slideIndex = slides.findIndex((s) => s.id === selectedSlideId) + 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !slide || thinking) return;
    setInput("");
    pushChat(selectedSlideId, { id: `u-${Date.now()}`, role: "user", text });
    setThinking(true);
    setTimeout(() => {
      const result = processChatMessage(text, slide);
      if (result) {
        applyEditFromChat(selectedSlideId, result.after, result.label);
      }
      setThinking(false);
    }, 800);
  };

  const suggestions = ["Make the title shorter", "Switch to two-column", "Rewrite in a casual tone", "Add a bullet"];

  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">AI assistant</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Editing slide {slideIndex}</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-3 w-3 text-background" />
              </div>
            )}
            <div className={`max-w-[75%] ${m.role === "user" ? "" : ""}`}>
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user" ? "bg-foreground text-background" : "bg-muted"
                }`}
              >
                {m.text}
              </div>
              {m.edit && (
                <button
                  onClick={() => undoEdit(selectedSlideId, m.id)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-1"
                >
                  <Undo2 className="h-3 w-3" /> Undo
                </button>
              )}
            </div>
            {m.role === "user" && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-3 w-3 text-background animate-pulse" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2 text-sm flex gap-1">
              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && !thinking && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs px-2 py-1 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask the AI to edit slide ${slideIndex}…`}
          className="h-9"
        />
        <Button size="sm" onClick={handleSend} disabled={!input.trim() || thinking} className="h-9">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
