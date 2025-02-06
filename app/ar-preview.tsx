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
      <Button className="font-bold text-xl" size="lg" onClick={() => setOnboarding(true)}>Play</Button>
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
  } 
}: {
  videoUrl: string, bannerData: {
    title: string,
    sub_title: string,
    redirect_url: string,
    show: boolean,
  }
}) {
  return (
    <div className="h-full w-full">
      <CameraFrame />
      <CardPreview
        videoUrl={videoUrl}
      />
      <Banner
        title={bannerData.title}
        sub_title={bannerData.sub_title}
        redirect_url={bannerData.redirect_url}
        show={bannerData.show}
      />
    </div>
  );
}
