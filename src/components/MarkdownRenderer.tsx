// components/MarkDownRenderer.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Define the MarkDownRenderer component
interface MarkDownRendererProps {
  message: string // Markdown string to render
  ref?: React.Ref<any> // Optional ref for forwarding
}

const MarkDownRenderer: React.FC<MarkDownRendererProps> = React.forwardRef(
  ({ message }, ref) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown features // Optional: add custom styling for readability
      >
        {message}
      </ReactMarkdown>
    )
  }
)

export default MarkDownRenderer
