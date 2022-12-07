import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism-light";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
SyntaxHighlighter.registerLanguage("tsx", tsx);

export default function ClientSideSyntaxHighlight({
  className,
  ...props
}: {
  className?: string;
  [spread: string]: any;
}) {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      style={vscDarkPlus}
      showLineNumbers={true}
    >
      {props.children}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props} />
  );
}
