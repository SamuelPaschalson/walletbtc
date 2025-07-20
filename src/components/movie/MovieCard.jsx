import React, {useState} from 'react';
import MovieDetails from './MovieDetails';

const MovieCard = ({movie}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleMouseEnter = () => {
    setShowDetails(true);
    // Start playing trailer or show more details (implementation below)
  };

  const handleMouseLeave = () => {
    setShowDetails(false);
    // Stop trailer or hide details (implementation below)
  };

  return (
    <div
      className="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <img src={movie.poster} alt={movie.title} />
      {showDetails && <MovieDetails movie={movie} />}
    </div>
  );
};

export default MovieCard;
