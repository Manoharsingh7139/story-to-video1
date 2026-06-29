import { useEffect, useRef } from "react";
import { useEditor, EditorContent, BubbleMenu, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered,
  Quote, RemoveFormatting, Eraser, Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeHtml, toRichHtml } from "@/lib/prototype/richText";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  singleLine?: boolean;
  allowLists?: boolean;
  showToolbar?: boolean;
  className?: string;
  contentClassName?: string;
  /** Inline mode: no border/padding, render directly within slide content. */
  inline?: boolean;
  /** Inline style for content (font, color, size) so it matches slide rendering. */
  contentStyle?: React.CSSProperties;
  autoFocus?: boolean;
}

const TEXT_COLORS = [
  { name: "Default", value: "" },
  { name: "Ink", value: "#141414" },
  { name: "Muted", value: "#6b7280" },
  { name: "Accent", value: "#E85D3A" },
  { name: "Green", value: "#16a34a" },
  { name: "Red", value: "#dc2626" },
  { name: "Blue", value: "#2563eb" },
  { name: "Amber", value: "#d97706" },
];

const ToolbarBtn = ({
  active, onClick, title, children,
}: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    className={cn(
      "h-7 w-7 inline-flex items-center justify-center rounded transition-colors",
      active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    )}
  >
    {children}
  </button>
);

const Toolbar = ({ editor, allowLists }: { editor: Editor; allowLists: boolean }) => {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-0.5 px-1 py-1 border border-border bg-card rounded-md shadow-sm">
      <ToolbarBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (⌘B)">
        <Bold className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (⌘I)">
        <Italic className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (⌘U)">
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <div className="w-px h-4 bg-border mx-0.5" />
      <ColorPicker editor={editor} />
      <ToolbarBtn
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight({ color: "#fde68a" }).run()}
        title="Highlight"
      >
        <Type className="h-3.5 w-3.5" />
      </ToolbarBtn>
      {allowLists && (
        <>
          <div className="w-px h-4 bg-border mx-0.5" />
          <ToolbarBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bulleted list">
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
            <Quote className="h-3.5 w-3.5" />
          </ToolbarBtn>
        </>
      )}
      <div className="w-px h-4 bg-border mx-0.5" />
      <ToolbarBtn onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear formatting">
        <Eraser className="h-3.5 w-3.5" />
      </ToolbarBtn>
    </div>
  );
};

const ColorPicker = ({ editor }: { editor: Editor }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative group" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        title="Text color"
        className="h-7 w-7 inline-flex items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <span className="text-[11px] font-bold leading-none">A</span>
        <span className="absolute bottom-1 w-3 h-0.5" style={{ background: editor.getAttributes("textStyle").color || "#141414" }} />
      </button>
      <div className="absolute z-50 left-0 top-full mt-1 p-1.5 bg-card border border-border rounded-md shadow-md hidden group-hover:grid grid-cols-4 gap-1 w-32">
        {TEXT_COLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            title={c.name}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (!c.value) editor.chain().focus().unsetColor().run();
              else editor.chain().focus().setColor(c.value).run();
            }}
            className="h-5 w-5 rounded border border-border"
            style={{ background: c.value || "transparent", backgroundImage: c.value ? "none" : "linear-gradient(45deg, transparent 47%, #999 48%, #999 52%, transparent 53%)" }}
          />
        ))}
      </div>
    </div>
  );
};

export const RichTextEditor = ({
  value, onChange, onFocus, placeholder, singleLine = false, allowLists = false,
  showToolbar = true, className, contentClassName, inline = false, contentStyle, autoFocus,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: allowLists ? {} : false,
        orderedList: allowLists ? {} : false,
        blockquote: allowLists ? {} : false,
        listItem: allowLists ? {} : false,
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: toRichHtml(value),
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(sanitizeHtml(html));
    },
    onFocus: () => onFocus?.(),
    editorProps: {
      attributes: {
        class: cn(
          "outline-none focus:outline-none w-full",
          singleLine && "whitespace-nowrap overflow-hidden",
          inline ? "" : "min-h-[80px] px-3 py-2",
          contentClassName,
        ),
      },
      handleKeyDown: (_view, event) => {
        if (singleLine && event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  // Sync external value changes without resetting cursor when focused
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = toRichHtml(value);
    if (!editor.isFocused && current !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (autoFocus && editor) {
      setTimeout(() => editor.commands.focus("end"), 0);
    }
  }, [autoFocus, editor]);

  if (!editor) return null;

  return (
    <div className={cn(inline ? "w-full" : "rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring", className)}>
      {showToolbar && !inline && (
        <div className="border-b border-border p-1">
          <Toolbar editor={editor} allowLists={allowLists} />
        </div>
      )}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 80, placement: "top" }}>
        <Toolbar editor={editor} allowLists={allowLists} />
      </BubbleMenu>
      <div style={contentStyle}>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};
