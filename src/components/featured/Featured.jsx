import React, { useEffect, useState, useRef } from "react";
import "./featured.scss";
import axios from "axios";
import {
  InfoOutlined,
  PlayArrow,
  Speaker,
  VolumeUp,
  Add,
} from "@material-ui/icons";
import { motion } from "framer-motion";

export default function Featured({ type, setGenre }) {
  const [content, setContent] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const getRandomContent = async () => {
      console.log(type);

      if (type == null || undefined) {
        try {
          const res = await axios.get(
            `https://whatsappbot-1-e6rt.onrender.com/api/movie/random-featured`
          );
          setContent(res.data.data);
          console.log(res.data.data);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(
            `https://whatsappbot-1-e6rt.onrender.com/api/movie/random?type=${type}`
          );
          console.log(res.data.data);
          setContent(res.data.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getRandomContent();
  }, [type]);

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movie" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={handleGenreChange}
            className="genre-select"
          >
            <option>All Genres</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}

      <img
        className="background"
        src={content.assets?.heroImage}
        alt={content.title}
        loading="lazy"
        style={{ opacity: 0.7, objectFit: "contain" }}
      />

      <div className="info">
        <img
          src={content.assets?.titleLogo || content.imgSm}
          alt={content.title}
          loading="lazy"
          className="title-image"
        />

        {/* <span className="desc">
          {content.desc || "No description available."}
        </span> */}

        <div className="buttons">
          <motion.button
            className="play"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayArrow />
            <span>Play</span>
          </motion.button>

          <motion.button
            className="more"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <InfoOutlined />
            <span>More Info</span>
          </motion.button>
        </div>
      </div>

      {content.limit && (
        <>
          <motion.button
            className="speaker"
            whileHover={{ scale: 1.05 }}
            // className="limit"
            whileTap={{ scale: 0.95 }}
          >
            {/* <VolumeUp /> */}
            <VolumeUp />
            {/* {/* <span>More Info</span> */}
          </motion.button>
          <div className="limit">
            <span>{content.rating}</span>
          </div>
        </>
      )}
    </div>
  );
}
