import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import InterviewPracticePage from "@/app/ai-interview-practice/page";
import WorkplaceEnglishPage from "@/app/workplace-english-practice/page";
import { SiteHeader } from "@/components/site-header";

describe("public acquisition CTAs", () => {
  it("routes homepage practice CTAs through the interview preview", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    expect(html).toContain("/practice-preview?scenario=hr_intro");
    expect(html).toContain("See a real interview question");
    expect(html).toContain('href="#feedback-preview"');
  });

  it("allows the preview header to send visitors directly to contextual signup", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, {
      ctaHref: "/signup?next=%2Fdashboard%3Fscenario%3Ddelayed_update",
      ctaLabel: "Join free",
      ctaDestination: "signup",
    }));
    expect(html).toContain("/signup?next=%2Fdashboard%3Fscenario%3Ddelayed_update");
    expect(html).toContain("Join free");
  });

  it("routes interview landing CTAs through an interview preview", () => {
    const html = renderToStaticMarkup(createElement(InterviewPracticePage));
    expect(html).toContain("/practice-preview?scenario=hr_intro");
    expect(html).not.toContain('href="/signup">Practise free');
  });

  it("routes workplace landing CTAs through a workplace preview", () => {
    const html = renderToStaticMarkup(createElement(WorkplaceEnglishPage));
    expect(html).toContain("/practice-preview?scenario=delayed_update");
    expect(html).not.toContain('href="/signup">Practise free');
  });
});
