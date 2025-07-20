import React, { useState, useRef, useEffect } from "react";
import "./listItem.scss";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
} from "@material-ui/icons";
import axios from "axios";
import VideoPlayer from "../videoplayer/VideoPlayer";
import Preview from "../preview/preview";

const ListItem = ({
  item,
  index,
  totalItems,
  setShowPreview,
  setPreviewData,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [movie, setMovie] = useState(null);
  const hoverTimeout = useRef(null);
  const videoTimeout = useRef(null);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(
          "https://whatsappbot-1-e6rt.onrender.com/api/movie/find/" + item._id
        );
        setMovie(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  const capitalizeFirst = (str) => {
    // return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const togglePreview = () => {
    clearTimeout(hoverTimeout.current);
    clearTimeout(videoTimeout.current);
    setIsHovered(false);
    setShowVideo(false);
    setShowPreview(true);
    const data = item._id;
    setPreviewData(data);
    // return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleHover = () => {
    clearTimeout(hoverTimeout.current);
    clearTimeout(videoTimeout.current);
    setIsHovered(true);
    videoTimeout.current = setTimeout(() => {
      setShowVideo(true);
    }, 1000);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimeout.current);
    clearTimeout(videoTimeout.current);
    setIsHovered(false);
    setShowVideo(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout.current);
      clearTimeout(videoTimeout.current);
    };
  }, []);

  return (
    <div
      className={`listItem ${isHovered ? "hovered" : ""} ${
        index === 0 ? "first" : index === totalItems - 1 ? "last" : ""
      }`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="mediaContainer">
        {!showVideo ? (
          <img
            src={movie?.assets?.hoverPreview}
            loading="lazy"
            alt={movie?.title}
            className="itemImage"
          />
        ) : (
          <VideoPlayer
            videoPreview={movie?.assets?.videoPreview}
            thumbnail={movie?.assets?.thumbnail}
            title={movie?.title}
          />
        )}
        {isHovered && (
          <div className="itemHover">
            <div className="itemInfo">
              <div
                className="icons"
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ display: "flex" }}>
                  <button className="icon play">
                    <img src="./assets/svg/Play.svg" alt="Play button" />
                  </button>
                  <button className="icon">
                    <img src="./assets/svg/Plus.svg" alt="addToList button" />
                  </button>
                  <button className="icon">
                    <img src="./assets/svg/ThumbsUp.svg" alt="Like button" />
                  </button>
                </div>
                <div>
                  <button className="icon" onClick={togglePreview}>
                    <img src="./assets/svg/Icon.svg" alt="More Info" />
                  </button>
                </div>
              </div>

              <div className="itemInfoTop">
                {movie?.uiStates?.isNewRelease !== true ? (
                  <span className="match tag new">New</span>
                ) : (
                  <span className="match tag new">
                    {movie?.uiStates?.matchScore}% Match
                  </span>
                )}
                <span className="rating">{movie?.rating}</span>
                <span className="seasons">
                  {movie?.isSeries
                    ? `${movie?.seriesInfo?.seasons} Seasons`
                    : "Movie"}
                </span>
                <span className="hd">HD</span>
              </div>

              <div className="genres">
                <span className="primary">
                  {capitalizeFirst(movie?.genres?.primary)}
                </span>
                {movie?.genres?.secondary?.map((genre, index) => (
                  <span key={index} className="secondary">
                    • {capitalizeFirst(genre)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
