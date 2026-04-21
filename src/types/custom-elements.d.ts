import type React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'cycling-news-ticker': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        headlines?: string
      }
    }
  }
}
