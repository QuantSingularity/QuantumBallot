import { useEffect, useRef } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

const Waveform = ({ audio, isPlaying, soundSpeech, setIsPlaying }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef({
    isPlaying: () => false,
  });
  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      responsive: true,
      barWidth: 1.5,
      barHeight: 0.5,
      cursorWidth: 0,
    });
    waveSurfer.load(audio);
    waveSurfer.on("ready", () => {
      waveSurferRef.current = waveSurfer;
    });
    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });
    return () => {
      setIsPlaying(soundSpeech.playing());
      waveSurfer.destroy();
    };
  }, [audio, setIsPlaying, soundSpeech.playing]);
  const togglePlayPause = () => {
    waveSurferRef.current.playPause();
    setIsPlaying(true);
  };
  return _jsxs("div", {
    className:
      "grid grid-cols-[40px,1fr] sm:grid-cols-[50px,1fr] md:grid-cols-[60px,0.8fr] items-center gap-2 p-0 m-0",
    children: [
      _jsx("button", {
        onClick: togglePlayPause,
        className:
          "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-none bg-white p-0 m-0",
        type: "button",
        children: isPlaying
          ? _jsx(FaPauseCircle, {
              className: "text-3xl sm:text-4xl md:text-5xl",
            })
          : _jsx(FaPlayCircle, {
              className: "text-3xl sm:text-4xl md:text-5xl",
            }),
      }),
      _jsx("div", { ref: containerRef, className: "p-0 m-0" }),
    ],
  });
};
export default Waveform;
