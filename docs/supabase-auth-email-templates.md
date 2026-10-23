# Supabase auth email templates

CareerSpeak uses server-side token-hash verification so confirmation and password-reset links work even when the user starts in one browser and opens the email in another.

In Supabase, open **Authentication → Email Templates** and replace the action link in the following templates. Keep any existing branded surrounding HTML.

## Confirm signup

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">
  Confirm email address
</a>
```

## Reset password

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">
  Reset password
</a>
```

The application always supplies a `RedirectTo` URL that already contains a `next` query parameter, so the added values correctly begin with `&`.

Also verify the following under **Authentication → URL Configuration**:

- Site URL: `https://www.careerspeak.tech`
- Redirect URL: `https://www.careerspeak.tech/auth/callback`
- For local testing: `http://localhost:3000/auth/callback`

Do not use `{{ .ConfirmationURL }}` for these two action buttons. That flow can require the PKCE verifier cookie from the browser that initiated the request.
