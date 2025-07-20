import React from 'react';

const MovieDetails = ({movie}) => {
  return (
    <div className="movie-details">
      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
      {/* You can add more details here */}
      {movie.trailer && (
        <div className="trailer">
          <iframe
            title={movie.title}
            width="100%"
            height="315"
            src={movie.trailer}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      )}
      {/* Add buttons (play, sound, plus, etc.) */}
      <div className="buttons">
        <button className="play-btn">Play</button>
        <button className="sound-btn">Sound</button>
        <button className="plus-btn">+</button>
        {/* Add more buttons as needed */}
      </div>
    </div>
  );
};

export default MovieDetails;
