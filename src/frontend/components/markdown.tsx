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
  const CopyButton = lazy(() => import("./copy-button"));

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
      }}
    >
      {markdown}
    </Markdown>
  );
};

export default MarkdownRenderer;
