import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Quote,
  ListOrdered,
  Code,
} from "lucide-react";

interface MarkdownToolbarProps {
  textRef: React.RefObject<HTMLTextAreaElement>;
}

export default function MarkdownToolbar({ textRef }: MarkdownToolbarProps) {
  const insertText = (before: string, after = "") => {
    const textarea = textRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + 
      before + selectedText + after + 
      text.substring(end);
    
    textarea.value = newText;
    textarea.focus();
    
    // Trigger input event to update form
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    // Set cursor position after insertion
    const newCursorPos = end + before.length + after.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  };

  const buttons = [
    { icon: Heading1, label: "H1", onClick: () => insertText("# ") },
    { icon: Heading2, label: "H2", onClick: () => insertText("## ") },
    { icon: Heading3, label: "H3", onClick: () => insertText("### ") },
    { icon: Bold, label: "Bold", onClick: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", onClick: () => insertText("*", "*") },
    { icon: List, label: "Bullet List", onClick: () => insertText("- ") },
    { icon: ListOrdered, label: "Numbered List", onClick: () => insertText("1. ") },
    { icon: Quote, label: "Quote", onClick: () => insertText("> ") },
    { icon: Code, label: "Code", onClick: () => insertText("`", "`") },
    { icon: Link, label: "Link", onClick: () => insertText("[", "](url)") },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {buttons.map((button) => (
        <Button
          key={button.label}
          variant="outline"
          size="icon"
          onClick={button.onClick}
          title={button.label}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
