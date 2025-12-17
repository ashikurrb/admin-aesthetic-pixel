"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useMemo } from "react";
import { useTheme } from "next-themes";

interface BlogContentViewerProps {
  content: string;
}

export default function BlogContentViewer({ content }: BlogContentViewerProps) {
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote({
    initialContent: JSON.parse(content),
    editable: false,
  });

  const blockNoteTheme = useMemo<"light" | "dark">(() => {
    return resolvedTheme === "dark" ? "dark" : "light";
  }, [resolvedTheme]);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <BlockNoteView editor={editor} theme={blockNoteTheme} editable={false} />
    </div>
  );
}
