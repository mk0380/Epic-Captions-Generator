import SparklesIcon from "@/components/SparklesIcon";
import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useEffect, useState, useRef } from "react";
import roboto from "./../fonts/Roboto-Regular.ttf";
import robotoBold from "./../fonts/Roboto-Bold.ttf";

export default function ResultVideo({ filename, transcriptionItems }) {
  const videoUrl =
    "https://mk-captions-generator.s3.ap-south-1.amazonaws.com/" + filename;
  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [trancode_active, setTrancode_active] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.src = videoUrl;
    load();
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto));
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));
    setLoaded(true);
  };

  function toFFmpegColor(rgb) {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return "&H" + bgr + "&";
  }

  const transcode = async () => {
    setTrancode_active(true);
    const ffmpeg = ffmpegRef.current;
    const srt = transcriptionItemsToSrt(transcriptionItems);
    await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
    await ffmpeg.writeFile("subs.srt", srt);
    videoRef.current.src = videoUrl;
    await new Promise((resolve, reject) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    const duration = videoRef.current.duration;
    ffmpeg.on("log", ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult && regexResult?.[1]) {
        const howMuchIsDone = regexResult?.[1];
        const [hours, minutes, seconds] = howMuchIsDone.split(":");
        const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
        const videoProgress = doneTotalSeconds / duration;
        setProgress(videoProgress);
      }
    });
    await ffmpeg.exec([
      "-i",
      filename,
      "-preset",
      "ultrafast",
      "-vf",
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(
        primaryColor
      )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
      "output.mp4",
    ]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    const blob = new Blob([data.buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    videoRef.current.src = url;

    setProgress(1);
  };

  const download = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = 'output.mp4';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
  }
  };

  return (
    <>
      <div className="mb-4">
        {progress !== 1?<button
          onClick={transcode}
          disabled={trancode_active}
          className="bg-green-600 py-2 px-6 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer"
          style={{ backgroundColor: trancode_active ? "red" : "" }}
        >
          <SparklesIcon />
          <span>Apply captions</span>
        </button>
        :
        <button
          onClick={download}
          disabled={!trancode_active}
          className="bg-green-600 py-2 px-6 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer"
        >
          <SparklesIcon />
          <span>Download</span>
        </button>}
      </div>
      <div>
        primary color:
        <input
          type="color"
          value={primaryColor}
          onChange={(ev) => setPrimaryColor(ev.target.value)}
        />
        <br />
        outline color:
        <input
          type="color"
          value={outlineColor}
          onChange={(ev) => setOutlineColor(ev.target.value)}
        />
      </div>
      <div className="rounded-xl overflow-hidden relative">
        {progress && progress < 1 && (
          <div className="absolute inset-0 bg-black/80 flex items-center">
            <div className="w-full text-center">
              <div className="bg-bg-gradient-from/50 mx-8 rounded-lg overflow-hidden relative">
                <div
                  className="bg-bg-gradient-from h-8"
                  style={{ width: progress * 100 + "%" }}
                >
                  <h3 className="text-white text-xl absolute inset-0 py-1">
                    {parseInt(progress * 100)}%
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <video data-video={0} ref={videoRef} controls></video>
      </div>
    </>
  );
}
