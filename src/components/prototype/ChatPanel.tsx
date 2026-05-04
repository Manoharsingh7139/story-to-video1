import { useState, useRef, useEffect } from "react";
import { usePrototypeStore } from "@/lib/prototype/store";
import { processChatMessage } from "@/lib/prototype/aiChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Undo2, Bot, User, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const ChatPanel = ({ collapsed, onToggleCollapsed }: Props) => {
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
      if (result) applyEditFromChat(selectedSlideId, result.after, result.label);
      setThinking(false);
    }, 700);
  };

  if (collapsed) {
    return (
      <div className="flex items-center gap-2 h-full px-3 bg-card border-t border-border">
        <button onClick={onToggleCollapsed} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ChevronUp className="h-3.5 w-3.5" />
          <Bot className="h-3.5 w-3.5" />
          <span className="font-medium">AI · slide {slideIndex}</span>
        </button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Edit this slide with AI…"
          className="h-7 text-xs flex-1"
        />
        <Button size="sm" onClick={handleSend} disabled={!input.trim() || thinking} className="h-7 w-7 p-0">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  const suggestions = ["Make title shorter", "Image on the right", "Switch to bullets", "Replace image"];

  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">AI assistant</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">slide {slideIndex}</span>
        </div>
        <button onClick={onToggleCollapsed} className="p-1 rounded hover:bg-muted">
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-2.5 w-2.5 text-background" />
              </div>
            )}
            <div className="max-w-[75%]">
              <div className={`rounded-md px-2.5 py-1.5 text-xs ${m.role === "user" ? "bg-foreground text-background" : "bg-muted"}`}>
                {m.text}
              </div>
              {m.edit && (
                <button
                  onClick={() => undoEdit(selectedSlideId, m.id)}
                  className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
                >
                  <Undo2 className="h-2.5 w-2.5" /> Undo
                </button>
              )}
            </div>
            {m.role === "user" && (
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2">
            <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-2.5 w-2.5 text-background animate-pulse" />
            </div>
            <div className="bg-muted rounded-md px-2.5 py-1.5 flex gap-1">
              <span className="h-1 w-1 bg-muted-foreground rounded-full animate-bounce" />
              <span className="h-1 w-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="h-1 w-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && !thinking && (
        <div className="px-3 pb-1.5 flex flex-wrap gap-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-2 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder={`Ask the AI to edit slide ${slideIndex}…`}
          className="h-8 text-xs"
        />
        <Button size="sm" onClick={handleSend} disabled={!input.trim() || thinking} className="h-8">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
