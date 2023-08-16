"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rangeParser from "parse-numeric-range";

// NOTE: SyntaxHighlighter is a client component
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism"; // syntax theming

SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

export default function Markdown({ markdown }: { markdown: string }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          // className can cause hydration error, only executes it after mounted
          const hasLang = /language-(\w+)/.exec(className || "");

          const hasMeta = !!node?.data?.meta;

          const applyHighlights: object = (applyHighlights: number) => {
            if (!hasMeta) return undefined;

            const RE = /{([\d,-]+)}/;

            const metadata =
              node.data && node.data.meta && typeof node.data.meta === "string"
                ? node.data.meta.replace(/\s/g, "")
                : "";

            const strlineNumbers =
              RE?.test(metadata) && RE?.exec(metadata)
                ? (RE.exec(metadata) as RegExpExecArray)[1]
                : "0";

            console.log(strlineNumbers);
            const highlightLines = rangeParser(strlineNumbers);
            const data: string | null = highlightLines.includes(applyHighlights)
              ? "!bg-red-300"
              : "!bg-yellow-300";

            console.log(data);
            return { data };
          };

          const shouldHighlight = !inline && hasLang && hasMounted;
          const contentToHighlight = String(children).replace(/\n$/, "");

          return shouldHighlight ? (
            <SyntaxHighlighter
              style={nightOwl}
              // NOTE:
              // executing "language" on server will somehow cause hydration error(mismatch on className)
              // so, do it after client mounted
              language={hasLang[1]}
              PreTag="div"
              className="codeStyle !my-0 !p-0"
              showLineNumbers={false}
              useInlineStyles={true}
              wrapLines={hasMeta}
              lineProps={applyHighlights}
            >
              {contentToHighlight}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
