"use client";

import ReactMarkdown from "react-markdown";
import rangeParser from "parse-numeric-range";

import { useHasMounted } from "@/hooks";

// NOTE: SyntaxHighlighter is a client component
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism"; // syntax theming
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";

SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

export default function Markdown({ markdown }: { markdown: string }) {
  const hasMounted = useHasMounted();

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const hasLang = /language-(\w+)/.exec(className || "");

          const hasMeta = !!node?.data?.meta;

          const applyLineStyle: object = (currentLineNumber: number) => {
            if (!hasMeta) return undefined;

            const RE = /{([\d,-]+)}/;

            const metadata =
              node.data && node.data.meta && typeof node.data.meta === "string"
                ? node.data.meta.replace(/\s/g, "")
                : "";

            // eg: "1-3,8"
            // eg: "0"
            const lineNumbers =
              RE?.test(metadata) && RE?.exec(metadata)
                ? (RE.exec(metadata) as RegExpExecArray)[1]
                : "0";

            // eg: [1,2,3,8]
            const linesToHighlight = rangeParser(lineNumbers);

            let style: Record<string, string> = { display: "block" };

            if (linesToHighlight.includes(currentLineNumber)) {
              style.backgroundColor = "rgba(220, 220, 220, 0.1)";
            }
            return { style };
          };

          const isLangSpecified = !inline && hasLang;
          const contentToHighlight = String(children).replace(/\n$/, "");

          return isLangSpecified ? (
            <SyntaxHighlighter
              style={nightOwl}
              // NOTE:
              // executing "language" on server will somehow cause hydration error(mismatch on className)
              // so, do it after client mounted
              language={hasMounted ? hasLang[1] : ""}
              PreTag="div"
              className="codeStyle !my-0 !p-0 flex"
              showLineNumbers={true}
              wrapLines={hasMeta}
              lineProps={applyLineStyle}
            >
              {contentToHighlight}
            </SyntaxHighlighter>
          ) : (
            <code className={`${className} p__inline-code`} {...props}>
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
