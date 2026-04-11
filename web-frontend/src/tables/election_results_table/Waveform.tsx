import type React from "react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import type { Howl } from "howler";

interface WaveformBaseProps {
  url?: string;
  audio?: string;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  soundSpeech?: Howl;
}

const Waveform: React.FC<WaveformBaseProps> = ({
  url,
  audio,
  isPlaying: externalIsPlaying,
  setIsPlaying: setExternalIsPlaying,
  soundSpeech,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const audioSrc = url ?? audio ?? "";
  const isControlled = soundSpeech !== undefined;
  const isPlaying = isControlled
    ? (externalIsPlaying ?? false)
    : internalIsPlaying;

  useEffect(() => {
    if (!waveformRef.current || !audioSrc || isControlled) return;

    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#f29EB0",
      progressColor: "#DE0031",
      height: 60,
      cursorWidth: 1,
      cursorColor: "#DE0031",
      barWidth: 2,
      barGap: 1,
    });

    waveSurfer.load(audioSrc);

    waveSurfer.on("ready", () => {
      waveSurferRef.current = waveSurfer;
    });

    waveSurfer.on("play", () => setInternalIsPlaying(true));
    waveSurfer.on("pause", () => setInternalIsPlaying(false));
    waveSurfer.on("finish", () => setInternalIsPlaying(false));

    return () => {
      waveSurfer.destroy();
    };
  }, [audioSrc, isControlled]);

  const handlePlayPause = () => {
    if (isControlled && soundSpeech) {
      if (externalIsPlaying) {
        soundSpeech.pause();
        setExternalIsPlaying?.(false);
      } else {
        soundSpeech.play();
        setExternalIsPlaying?.(true);
      }
    } else if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!isControlled && (
        <div
          ref={waveformRef}
          className="w-full rounded-lg overflow-hidden bg-gray-50"
        />
      )}
      <button
        onClick={handlePlayPause}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700
          text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-red-600/20"
      >
        {isPlaying ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </>
        )}
      </button>
    </div>
  );
};

export default Waveform;
