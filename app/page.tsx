import ARPreview from "./ar-preview";
import { notFound } from "next/navigation";
export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ sh?: string }>
}) {
  const { sh } = await searchParams;

  if (!sh) {
    return notFound();
  }

  const res = await fetch(`https://zingcam.prod.flamapp.com/campaign-svc/api/v1/campaigns/${sh}/experiences`);
  const data = await res.json();

  if (data.status !== 200) {
    return notFound();
  }

  const experience = data?.data?.experiences[0];
  const videoUrl = experience?.videos?.compressed;

  const bannerData = {
    title: experience?.ui_elements?.banners?.title,
    sub_title: experience?.ui_elements?.banners?.sub_title,
    redirect_url: experience?.ui_elements?.banners?.redirection_url,
    show: !experience?.ui_elements?.banners || experience?.ui_elements?.banners?.variant !== 0,
    primary_color: experience?.ui_elements?.banners?.primary_color,
    secondary_color: experience?.ui_elements?.banners?.secondary_color,
  }

  return (
    <>
      <ARPreview 
        videoUrl={videoUrl} 
        bannerData={bannerData}
      />
    </>
  );
}