import React from "react";
import Page from "../pages/_shared/Page";
import Hero from "../components/home/Hero";
import StatsStrip from "../components/home/StatsStrip";
import FeatureGrid from "../components/home/FeatureGrid";
import HowItWorks from "../components/home/HowItWorks";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <Page>
      <Hero />
      <StatsStrip />
      <FeatureGrid />
      <HowItWorks />
      <CTASection />
    </Page>
  );
}
