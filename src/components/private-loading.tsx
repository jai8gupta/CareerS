export function PrivateLoading({ label = "Loading your workspace" }: { label?: string }) {
  return <div className="dashboardShell"><div className="dashboardLoading" role="status" aria-live="polite"><span className="spinner spinnerLarge" aria-hidden="true"/><strong>{label}…</strong><span>Please hold on a moment.</span></div></div>;
}
