import { DashboardHeader } from "@/components/dashboard-header";
import { PracticeStudio } from "@/components/practice-studio";

export default function DashboardMobilePreview() {
  return (
    <div className="dashboardShell">
      <DashboardHeader />
      <main className="container dashboardMain">
        <section className="dashIntro">
          <div>
            <p className="eyebrow">Today’s five-minute practice</p>
            <h1>Ready, Jai?</h1>
            <p>One real career moment. One stronger answer.</p>
          </div>
          <div className="usageCard">
            <div><span>AI reviews this month</span><strong>0 / 3</strong></div>
            <div className="miniBar"><i style={{ width: "0%" }} /></div>
          </div>
        </section>
        <PracticeStudio remaining={3} />
      </main>
    </div>
  );
}
