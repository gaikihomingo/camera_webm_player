"use client";

import { useState } from "react";
import Banner from "./banner";
import CameraFrame from "./camera-frame";
import CardPreview from "./card-preview";

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
    <div>
      <button onClick={() => setOnboarding(true)}>Play</button>
    </div>
  );
}

function FakeAR() {
  return (
    <div className="">
      <CameraFrame />
      <CardPreview 
        videoUrl={"https://zingcam.cdn.flamapp.com/compressed/videos/679d0b7c88d1a4597a401dfe_108509206.mp4"} 
      />
      <Banner />
    </div>
  );
}
