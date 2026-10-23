# CareerSpeak conversion events

CareerSpeak uses the existing Vercel Web Analytics integration through the typed `trackFunnel` wrapper in `src/lib/analytics.ts`. The wrapper adds only sanitized campaign fields and honours browser Do Not Track. `signup_completed` is emitted from the successful Supabase server action rather than inferred from a URL. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` to disable custom events.

No event may contain an email, name, password, auth token, payment identifier, raw audio, transcript, answer, or feedback text.

| Event | Trigger | Properties | Destination | Production verification |
| --- | --- | --- | --- | --- |
| `landing_viewed` | Homepage first renders in a browser session | `page` | Vercel Web Analytics | Open `/` once and filter Events by name. |
| `primary_cta_clicked` | A primary acquisition CTA is clicked | `placement`, `destination`, optional `plan` | Vercel Web Analytics | Click homepage, use-case, About, header, and pricing CTAs and compare `placement`. |
| `practice_preview_viewed` | Public practice preview renders | `scenario` | Vercel Web Analytics | Open a contextual preview URL and confirm one event per scenario/session. |
| `practice_preview_cta_clicked` | Preview signup CTA is clicked | `scenario` | Vercel Web Analytics | Select a scenario, continue to signup, and confirm its scenario property. |
| `signup_page_viewed` | Signup page renders | `intent` | Vercel Web Analytics | Open practice-, plan-, and generic-signup journeys and compare `intent`. |
| `signup_form_started` | First focus anywhere in signup form | `intent` | Vercel Web Analytics | Focus multiple fields; confirm only one event for the form interaction. |
| `signup_submitted` | Signup form is submitted | `intent` | Vercel Web Analytics | Submit once and confirm one attempt event. |
| `signup_failed` | Signup returns a sanitized error category | `category` | Vercel Web Analytics | Trigger a safe test failure and confirm only the normalized category. |
| `signup_completed` | Supabase successfully accepts account creation | `intent` | Vercel Web Analytics server event | Complete a new registration; confirm one event and no email/name properties. |
| `practice_prompt_viewed` | A practice prompt becomes active | `scenario` | Vercel Web Analytics | Change preview/dashboard prompts and confirm scenario-specific events. |
| `microphone_permission_result` | Browser resolves or rejects microphone access | `result` | Vercel Web Analytics | Test allow and deny in separate browser permission states. |
| `practice_started` | Audio recording begins | `scenario`, `method` | Vercel Web Analytics | Start a recording and confirm the selected scenario. |
| `practice_submitted` | Answer is submitted to the protected feedback API | `scenario`, `method` | Vercel Web Analytics | Submit voice and typed answers; compare `method`. |
| `practice_failed` | Permission, transcription, or feedback stage fails | `stage`, `category` | Vercel Web Analytics | Exercise a controlled failure and confirm no answer content is present. |
| `feedback_ready` | Protected feedback API returns successfully | `scenario` | Vercel Web Analytics | Complete a review and confirm it fires after the successful response. |
| `feedback_viewed` | Feedback UI renders | `scenario` | Vercel Web Analytics | Confirm the rendered feedback produces one event. |
| `practice_retried` | User chooses to retry the same prompt | `scenario` | Vercel Web Analytics | Click retry and confirm the same scenario. |
| `pricing_viewed` | Pricing page renders | `signed_in` | Vercel Web Analytics | Open pricing signed out and signed in. |
| `checkout_started` | Server creates a Razorpay checkout attempt | `plan`, `kind` | Vercel Web Analytics | Start checkout and confirm the plan/kind after server creation. |
| `purchase_verified` | Server verifies the Razorpay signature and payment attempt | `plan`, `kind` | Vercel Web Analytics | Complete a test/live payment and reconcile with the verified database attempt. |

The following attribution values are accepted: `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`. Values are limited to 80 characters and a conservative character set. They are stored only for the current browser tab and attached to custom events. `utm_term`, referrer URLs, and arbitrary query parameters are deliberately excluded.

Events with a natural once-only meaning use session-storage deduplication. `signup_completed` is server-authoritative and is not re-emitted by the login page. Payment identifiers are used only in local deduplication keys and are never sent to analytics. Razorpay webhooks remain the authoritative payment record and are independently deduplicated by `webhook_events` in Postgres.

Local unit tests verify payload construction and deduplication, but Vercel's production event destination must be checked after deployment in **Vercel → Project → Analytics → Events**. Browser Do Not Track and `NEXT_PUBLIC_ANALYTICS_ENABLED=false` intentionally suppress events.
