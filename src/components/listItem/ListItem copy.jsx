import './listItem.scss';
import React from 'react';
import {useState, useEffect} from 'react';
import {
  AddOutlined,
  Close,
  PlayArrow,
  ThumbDownAltOutlined,
  ThumbUpAltOutlined,
  VolumeUp,
  VolumeOff,
  KeyboardArrowLeftOutlined,
} from '@material-ui/icons';
import axios from 'axios';

export default function ListItem({item, onPreview, index, prev, setArrow}) {
  const [movie, setMovie] = useState([]);
  const ref = React.createRef();
  const timeoutRef = React.createRef(null);
  const [hovered, setHovered] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8800/api/movie/find/' + item,
        );
        // console.log(item);
        setMovie(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  const handleMouseEnter = () => {
    setArrow(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Start playing the video after 1 seconds
      setHovered(true);
      setVideoPlaying(true);
      console.log(hovered);
      console.log(videoPlaying);
    }, 2000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setHovered(false);
    setVideoPlaying(false); // Stop the video when leaving
    console.log(hovered);
    console.log(videoPlaying);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current); // cleanup on unmount
  }, []);

  const handleClick = () => {
    setHovered(false);
    onPreview(item);
    console.log(item);
    setVideoPlaying(false); // Stop the video when clicked
  };
  return (
    <li
      className={`movieRowItem ${hovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
    >
      <div className="img">
        {!hovered && !videoPlaying ? (
          // Render the image or loading state
          movie.img != null ? (
            <img loading="lazy" src={movie.img} />
          ) : (
            <>
              <div className="movieRowItemError">
                <div>
                  <p>{movie.title}</p>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <video
              ref={ref}
              autoPlay
              // controls
              src={movie.trailer}
              width="100%"
              height="100%"
              objectfit="contain"
            />
            <div className="itemInfo">
              <div className="icons">
                <PlayArrow className="icon" />
                <AddOutlined className="icon" />
                <ThumbUpAltOutlined className="icon" />
                <ThumbDownAltOutlined className="icon" />
              </div>
              <div className="itemInfoTop">
                <span className="match">{movie.duration}99% match</span>
                <span className="duration">{movie.duration}</span>
                <span className="limit">+{movie.limit}</span>
                <span>{movie.year}</span>
              </div>
              {/* <div className='desc'>{movie.desc}</div> */}
              <div className="genre">
                <span>{movie.genre}</span>
                <span>{movie.genre1}</span>
                <span>{movie.genre2}</span>
              </div>
            </div>
          </>
        )}
        {(hovered && !videoPlaying) ||
          (!hovered && videoPlaying && (
            <>
              <img loading="lazy" src={movie.img} />
            </>
          ))}
      </div>
    </li>
  );
}
