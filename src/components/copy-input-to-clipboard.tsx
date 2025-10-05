"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

interface CopyInputToClipboardProps {
  text: string;
}

export function CopyInputToClipboard({ text }: CopyInputToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <Input
          value={text}
          readOnly
          disabled
          className="pr-12 font-mono text-sm bg-muted/50 border-muted-foreground/20 cursor-default"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted-foreground/10"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
