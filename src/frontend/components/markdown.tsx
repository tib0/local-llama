import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { lazy, Suspense } from "react";
import Markdown from "react-markdown";

type MarkdownRendererProps = {
  children: string;
};

const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
  const CopyButton = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./copy-button") as any), 500);
    });
  });

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="code-block">
              <Suspense
                fallback={
                  <div className="skeleton h-6 w-6 shrink-0 rounded-full copy-button"></div>
                }
              >
                <CopyButton code={String(children)} />
              </Suspense>
              <SyntaxHighlighter
                wrapLines={true}
                style={vscDarkPlus}
                PreTag="div"
                language={match[1]}
                className="text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ ...props }: any) {
          return (
            <a
              className="link link-primary font-semibold"
              aria-label="Open link in default browser"
              tabIndex={0}
              href={undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.electronAPI.openExternalLink(props.href);
              }}
            >
              {props.children}
            </a>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};

export default MarkdownRenderer;
