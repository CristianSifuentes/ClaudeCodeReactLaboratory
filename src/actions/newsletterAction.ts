// ─── Server Action — Newsletter Subscription ─────────────────────────────────
//
// @CONCEPT: Server Actions (React 19 / Next.js App Router)
// A Server Action is a function that runs EXCLUSIVELY on the server.
// In a Next.js app you would add "use server" at the top of this file.
// The client calls it like a regular async function, but React serialises
// the call over an HTTP POST — no manual fetch(), no API route needed.
//
// Benefits:
// 1. Database logic stays server-side (no secret leakage to the client)
// 2. Automatic loading states via useActionState / useFormStatus
// 3. Progressive enhancement: forms work without JavaScript
//
// "use server"  ← would be here in production Next.js

import type { NewsletterFormState } from '../types'

// Simulates a server-side database insert / email-service call.
// In production: await db.subscriber.create({ email }) or
//                await resend.emails.send(...)
export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  // @CONCEPT: Server Action receives FormData directly — no JSON.stringify,
  // no manual event.preventDefault(), React handles all of that.
  const email = formData.get('email')?.toString().trim() ?? ''

  // Simulate network latency (replace with real async work)
  await new Promise(r => setTimeout(r, 1200))

  if (!email.includes('@')) {
    // @CONCEPT: Returning an error state — this becomes the new value of
    // `state` inside useActionState on the client, driving the UI update.
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // Simulate occasional server errors to demonstrate error handling
  if (email.endsWith('.test')) {
    return { status: 'error', message: 'Server error. Please try again.' }
  }

  return {
    status: 'success',
    message: `You're in! Check ${email} for your welcome email.`,
  }
}
