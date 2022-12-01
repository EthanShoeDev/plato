import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import MarkDownEthan from './mdx.mdx' // Assumes an integration is used to compile MDX -> JS.
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';


function code({className, ...props}: {className?: string, [spread: string]: any}) {
  const match = /language-(\w+)/.exec(className || '')
  return match
    ? <SyntaxHighlighter language={match[1]} PreTag="div" style={vscDarkPlus} showLineNumbers >
        {props.children}
    </SyntaxHighlighter>
    : <code className={className} {...props} />
}


export default function Temp() {
    return (
<MarkDownEthan components={{code}} />
);
    }