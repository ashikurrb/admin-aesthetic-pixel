"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo } from "react";
import { useTheme } from "next-themes";

interface BlogContentViewerProps {
  content: string;
}

export default function BlogContentViewer({ content }: BlogContentViewerProps) {
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote({
  });

  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(content) as Block[];
    } catch (error) {
      console.error("Failed to parse BlockNote content:", error);
      return undefined;
    }
  }, [content]);

  useEffect(() => {
    if (editor && parsedContent) {
      editor.replaceBlocks(editor.document, parsedContent);
    }
  }, [editor, parsedContent]);

  const blockNoteTheme = resolvedTheme === "dark" ? "dark" : "light";

  if (!editor) return null;

  return (
    <div className="bn-viewer max-w-none w-full">
      <BlockNoteView 
        editor={editor} 
        theme={blockNoteTheme} 
        editable={false}
      />
    </div>
  );
}