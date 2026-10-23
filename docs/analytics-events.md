# CareerSpeak conversion events

CareerSpeak uses the existing Vercel Web Analytics integration through the typed `trackFunnel` wrapper in `src/lib/analytics.ts`. The wrapper adds only sanitized campaign fields and honours browser Do Not Track. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` to disable custom events.

No event may contain an email, name, password, auth token, payment identifier, raw audio, transcript, answer, or feedback text.

| Event | Trigger | Properties |
| --- | --- | --- |
| `landing_viewed` | Homepage first renders in a browser session | `page` |
| `primary_cta_clicked` | A primary homepage/header CTA is clicked | `placement`, `destination` |
| `practice_preview_viewed` | Public practice preview renders | `scenario` |
| `practice_preview_cta_clicked` | Preview signup CTA is clicked | `scenario` |
| `signup_page_viewed` | Signup page renders | `intent` |
| `signup_form_started` | First focus anywhere in signup form | `intent` |
| `signup_submitted` | Signup form is submitted | `intent` |
| `signup_failed` | Signup returns a sanitized error category | `category` |
| `signup_completed` | Supabase accepts registration and redirects to login | `intent` |
| `practice_prompt_viewed` | A practice prompt becomes active | `scenario` |
| `microphone_permission_result` | Browser resolves or rejects microphone access | `result` |
| `practice_started` | Audio recording begins | `scenario`, `method` |
| `practice_submitted` | Answer is submitted to protected feedback API | `scenario`, `method` |
| `practice_failed` | Permission, transcription, or feedback stage fails | `stage`, `category` |
| `feedback_ready` | Protected feedback API returns successfully | `scenario` |
| `feedback_viewed` | Feedback UI renders | `scenario` |
| `practice_retried` | User chooses to retry the same prompt | `scenario` |
| `pricing_viewed` | Pricing page renders | `signed_in` |
| `checkout_started` | Server creates a verified Razorpay checkout attempt | `plan`, `kind` |
| `purchase_verified` | Server verifies the Razorpay signature and payment attempt | `plan`, `kind` |

The following attribution values are accepted: `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`. Values are limited to 80 characters and a conservative character set. They are stored only for the current browser tab and attached to custom events. `utm_term`, referrer URLs, and arbitrary query parameters are deliberately excluded.

Events with a natural once-only meaning use session-storage deduplication. Payment identifiers are used only in local deduplication keys and are never sent to analytics. Razorpay webhooks remain the authoritative payment record and are independently deduplicated by `webhook_events` in Postgres.
