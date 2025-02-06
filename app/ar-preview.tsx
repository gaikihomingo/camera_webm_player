"use client";

import { useState } from "react";
import Banner from "./banner";
import CameraFrame from "./camera-frame";
import CardPreview from "./card-preview";
import { Button } from "@/components/ui/button";

export default function ARPreview({ videoUrl, bannerData }: {
  videoUrl: string, bannerData: {
    title: string,
    sub_title: string,
    redirect_url: string,
    show: boolean,
    primary_color: string,
    secondary_color: string,
  }
}) {
  const [onboarding, setOnboarding] = useState(false);

  return (
    <>
      {onboarding ? <FakeAR videoUrl={videoUrl} bannerData={bannerData} /> : <OnboardingScreen setOnboarding={setOnboarding} />}
    </>
  );
};

function OnboardingScreen({ setOnboarding }: { setOnboarding: (play: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Button className="font-bold text-xl" size="lg" onClick={() => setOnboarding(true)}>Start Experience</Button>
    </div>
  );
}

function FakeAR({ 
  videoUrl, 
  bannerData = {
    title: "",
    sub_title: "",
    redirect_url: "",
    show: false,
    primary_color: "",
    secondary_color: "",
  } 
}: {
  videoUrl: string, bannerData: {
    title: string,
    sub_title: string,
    redirect_url: string,
    show: boolean,
    primary_color: string,
    secondary_color: string,
  }
}) {
  return (
    <div className="relative h-full w-full">
      <CameraFrame />
      <CardPreview
        videoUrl={videoUrl}
      />
      <Banner
        title={bannerData.title}
        sub_title={bannerData.sub_title}
        redirect_url={bannerData.redirect_url}
        show={bannerData.show}
        primary_color={bannerData.primary_color}
        secondary_color={bannerData.secondary_color}
      />
    </div>
  );
}
