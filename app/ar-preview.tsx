"use client";

import { useState } from "react";
import Banner from "./banner";
import CameraFrame from "./camera-frame";
import CardPreview from "./card-preview";
import { Button } from "@/components/ui/button";

export default function ARPreview() {
  const [onboarding, setOnboarding] = useState(false);

  return (
    <>
      {onboarding ? <FakeAR /> : <OnboardingScreen setOnboarding={setOnboarding} />}
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

function FakeAR() {
  return (
    <div className="h-full w-full">
      <CameraFrame />
      <CardPreview 
        videoUrl={"https://zingcam.cdn.flamapp.com/compressed/videos/679d0b7c88d1a4597a401dfe_108509206.mp4"} 
      />
      <Banner 
        title="Register now"
        sub_title="Get 10% discount"
        redirect_url="/"
        show={true}
      />
    </div>
  );
}
