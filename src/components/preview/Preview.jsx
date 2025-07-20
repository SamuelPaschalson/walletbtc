import React, { useState, useEffect } from "react";
import "./preview.scss";
import axios from "axios";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  Close,
  VolumeUp,
  VolumeOff,
} from "@material-ui/icons";
import spinnerImage from "../../assets/spinner.png";
import errorImage from "../../assets/error-back.png";
import { motion } from "framer-motion";

const Preview = ({ item, onClose }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const capitalizeFirst = (str) => {
    // return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://whatsappbot-1-e6rt.onrender.com/api/movie/find/${item}`
        );
        setMovie(res.data.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [item]);

  const toggleMute = () => setIsMuted(!isMuted);

  if (loading) {
    return (
      <div className="preview-loading-overlay">
        <div className="spinner-container">
          <img src={spinnerImage} className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="preview-error-overlay">
        <div className="error-container">
          <img
            src={errorImage}
            alt="Error loading content"
            className="error-image"
          />
          <p>Failed to load content</p>
          <button onClick={onClose} className="error-close-button">
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="preview-overlay">
      <div className="preview-container">
        {/* Backdrop with gradient overlay */}
        <div className="preview-backdrop">
          <img
            src={movie.assets?.heroImage}
            alt={movie.title}
            className="backdrop-image"
          />
          <img
            src={movie.assets?.titleLogo}
            alt={movie.title}
            className="logo-image"
          />
          <div className="backdrop-gradient" />

          {/* Close button */}
          <button className="close-button" onClick={onClose}>
            <Close />
          </button>

          {/* Mute toggle */}
          <button className="mute-button" onClick={toggleMute}>
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </button>
          {/* Action buttons */}
          <div
            className="preview-icons"
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex" }}>
              <motion.button
                className="preview-play"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="./assets/svg/Play.svg" alt="Play button" />
                <span>Play</span>
              </motion.button>
              <motion.button className="preview-icon">
                <img src="./assets/svg/Plus.svg" alt="addToList button" />
              </motion.button>
              <motion.button className="preview-icon">
                <img src="./assets/svg/ThumbsUp.svg" alt="Like button" />
              </motion.button>
            </div>
          </div>
        </div>
        <div className="preview-content">
          {/* Title and basic info */}
          <div className="preview-header">
            <div className="preview-meta">
              {movie?.uiStates?.isNewRelease !== true ? (
                <span className="match tag new">New</span>
              ) : (
                <span className="match tag new">
                  {movie?.uiStates?.matchScore}% Match
                </span>
              )}
              <span className="seasons">
                {movie.isSeries
                  ? `${movie.seriesInfo?.seasons} Seasons`
                  : "Movie"}
              </span>
              <span className="year">{movie.year}</span>
              <span className="hd-badge">HD</span>
              <span className="rating">{movie.rating}</span>
            </div>

            <div className="preview-tags">
              {movie.genres?.primary && (
                <span className="primary-tag">
                  {capitalizeFirst(movie.genres.primary)}
                </span>
              )}
              {movie.genres?.secondary?.map((genre, i) => (
                <span key={i} className="secondary-tag">
                  • {capitalizeFirst(genre)}
                </span>
              ))}
            </div>

            {/* <p className="preview-rank">#2 in TV Shows Today</p> */}
          </div>

          {/* Description */}
          <p className="preview-description">
            {movie.desc || "No description available."}
          </p>

          {/* Genres info */}
          <div className="preview-genres">
            <span>Genres: </span>
            <span>
              {capitalizeFirst(movie.genres?.primary)},{" "}
              {capitalizeFirst(movie.genres?.secondary?.join(", "))}
            </span>
          </div>

          {/* Episodes section (for series) */}
          {/* {movie.isSeries && (
            <div className="episodes-section">
              <h3>Episodes</h3>
              <div className="episode-card">
                <h4>House of Ninjas</h4>
                <p>
                  While Haru Tanara develops a crush on a mysterious young woman
                  at work...
                </p>
                <div className="episode-meta">
                  <span className="episode-title">The Offer</span>
                  <span className="episode-duration">52m</span>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Content section */}
      </div>
    </div>
  );
};

export default Preview;
