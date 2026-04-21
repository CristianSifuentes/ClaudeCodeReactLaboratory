import { useActionState, useOptimistic, useState, useTransition } from 'react'
import { subscribeToNewsletter } from '../actions/newsletterAction'
import type { NewsletterFormState } from '../types'

const INITIAL_STATE: NewsletterFormState = {
  status: 'idle',
  message: 'Subscribe and receive weekly pro training insights.',
}

export default function NewsletterSection() {
  // @CONCEPT: useActionState
  // This hook connects a form directly to a server action.
  // No manual fetch() or API endpoint wiring is required.
  const [state, formAction, isSubmitting] = useActionState(
    subscribeToNewsletter,
    INITIAL_STATE,
  )

  // @CONCEPT: useOptimistic
  // We show an immediate optimistic toast-like message as soon as submit starts.
  const [optimisticMessage, setOptimisticMessage] = useOptimistic(
    state.message,
    (_current, optimistic: string) => optimistic,
  )

  // @CONCEPT: useTransition
  // Non-urgent visual message updates are wrapped in a transition.
  const [, startTransition] = useTransition()

  const [emailPreview, setEmailPreview] = useState('')

  function handleInput(value: string) {
    startTransition(() => {
      setEmailPreview(value)
    })
  }

  return (
    <section id="about" style={{ background: '#090909', padding: '0 0 100px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1e1e, #101010)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '32px 24px' }}>
          <h3 style={{ margin: '0 0 10px', color: '#fff', fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Become a 2026 React + Cycling Commerce Pro
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.62)', margin: '0 0 20px', lineHeight: 1.7 }}>
            This form demonstrates Server Actions + useActionState + useOptimistic in one production-style workflow.
          </p>

          <form
            action={async formData => {
              setOptimisticMessage('Submitting to server action…')
              await formAction(formData)
            }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@peloton.dev"
              onChange={e => handleInput(e.target.value)}
              style={{
                flex: '1 1 260px',
                minWidth: 220,
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                padding: '12px 14px',
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                border: 'none',
                borderRadius: 10,
                background: '#e53935',
                color: '#fff',
                padding: '12px 18px',
                fontWeight: 700,
                cursor: isSubmitting ? 'wait' : 'pointer',
              }}
            >
              {isSubmitting ? 'Submitting…' : 'Join Newsletter'}
            </button>
          </form>

          <p style={{ margin: '12px 0 0', color: state.status === 'error' ? '#ef9a9a' : '#81c784', fontSize: 13 }}>
            {optimisticMessage}
          </p>
          {emailPreview && (
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
              Preview: we will send updates to <strong>{emailPreview}</strong>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
