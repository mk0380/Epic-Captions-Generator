import SparklesIcon from "@/components/SparklesIcon";

export default function DemoSection() {
  return (
    <section className="flex justify-around mt-8 sm:mt-12 items-center">
      <div className="hidden sm:block bg-gray-800/50 w-[240px] rounded-xl overflow-hidden">
        <video src="https://res.cloudinary.com/dk7evovzs/video/upload/v1723196738/captions-generator/without-captions_mzqa9o.mp4" preload="" muted autoPlay loop></video>
      </div>
      <div className="hidden sm:block">
        <SparklesIcon />
      </div>
      <div className="bg-gray-800/50 w-[240px] rounded-xl overflow-hidden">
        <video src="https://res.cloudinary.com/dk7evovzs/video/upload/v1723196760/captions-generator/with-captions_vevmgl.mp4" preload="" muted autoPlay loop></video>
      </div>
    </section>
  );
}