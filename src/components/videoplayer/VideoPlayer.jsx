import React, { useState, useRef, useEffect } from "react";
import "./videoPlayer.scss";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Replay,
} from "@material-ui/icons";

const VideoPlayer = ({ videoPreview, thumbnail, title, style }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  // Get the best available video source
  const getVideoSource = () => {
    if ((!videoPreview, !thumbnail, !title)) return "";

    // Prefer the videoPreview if available
    if (videoPreview) {
      // Handle YouTube URLs
      if (videoPreview.includes("youtube.com/watch?v=")) {
        const videoKey = videoPreview.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0`;
      }
      return videoPreview;
    }

    // Fallback to thumbnail if no video available
    return "";
  };

  const videoSource = getVideoSource();
  const isYouTubeEmbed = videoSource.includes("youtube.com/embed");

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("canplay", handlePlay);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("canplay", handlePlay);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((e) => {
          console.log("Play error:", e);
          setIsPlaying(false);
        });
        setHasEnded(false);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoSource]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen?.().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleVideoEnd = () => {
    setHasEnded(true);
    setIsPlaying(false);
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
      setHasEnded(false);
    }
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(controlsTimeout.current);
    };
  }, []);

  if ((!videoPreview, !thumbnail, !title)) {
    return (
      <div className="videoPlayer" style={style}>
        <div className="videoPlaceholder">
          <p>No video content available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="videoPlayer"
      ref={playerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      style={style}
    >
      {isYouTubeEmbed ? (
        <iframe
          src={videoSource}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="videoFrame"
          title={`${title} trailer`}
        />
      ) : (
        <>
          {isLoading && !hasEnded && (
            <div className="loadingOverlay">
              <div className="loadingSpinner" />
              <img
                src={thumbnail}
                alt={`${title} thumbnail`}
                className="thumbnailPreview"
              />
            </div>
          )}

          <video
            ref={videoRef}
            src={videoSource}
            autoPlay
            loop={!hasEnded}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            onClick={togglePlayPause}
            poster={thumbnail}
          />

          {hasEnded && (
            <button className="replayButton" onClick={replayVideo}>
              <Replay fontSize="large" />
              <span>Watch Again</span>
            </button>
          )}

          <div
            className={`videoControls ${
              showControls || hasEnded ? "visible" : ""
            }`}
          >
            <div className="progressBar" onClick={handleSeek}>
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>

            <div className="controls">
              <div className="leftControls">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasEnded) {
                      replayVideo();
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {hasEnded ? (
                    <Replay />
                  ) : isPlaying ? (
                    <Pause />
                  ) : (
                    <PlayArrow />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </button>
                <span className="timeInfo">
                  {videoRef.current && !isNaN(videoRef.current.duration)
                    ? `${formatTime(
                        videoRef.current.currentTime
                      )} / ${formatTime(videoRef.current.duration)}`
                    : "--:--"}
                </span>
              </div>

              <div className="rightControls">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreen();
                  }}
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  <Fullscreen />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default VideoPlayer;
