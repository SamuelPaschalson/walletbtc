import React, { useEffect } from "react";
import { useHistory } from "react-router-dom"; // Using useHistory instead of useNavigate
import "./start.scss";
import netaudio from "../../assets/netflix.mp3";

const Start = () => {
  const history = useHistory(); // Using useHistory for v5

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push("/browse"); // Using history.push instead of navigate
    }, 4000);

    return () => clearTimeout(timer);
  }, [history]); // Add history to dependency array

  return (
    <div className="netflixIntro">
      <div className="n" letter="N">
        <div className="helper1">
          <div className="effectBrush">
            <span className="fur31"></span>
            <span className="fur30"></span>
            <span className="fur29"></span>
            <span className="fur28"></span>
            <span className="fur27"></span>
            <span className="fur26"></span>
            <span className="fur25"></span>
            <span className="fur24"></span>
            <span className="fur23"></span>
            <span className="fur22"></span>
            <span className="fur21"></span>
            <span className="fur20"></span>
            <span className="fur19"></span>
            <span className="fur18"></span>
            <span className="fur17"></span>
            <span className="fur16"></span>
            <span className="fur15"></span>
            <span className="fur14"></span>
            <span className="fur13"></span>
            <span className="fur12"></span>
            <span className="fur11"></span>
            <span className="fur10"></span>
            <span className="fur9"></span>
            <span className="fur8"></span>
            <span className="fur7"></span>
            <span className="fur6"></span>
            <span className="fur5"></span>
            <span className="fur4"></span>
            <span className="fur3"></span>
            <span className="fur2"></span>
            <span className="fur1"></span>
          </div>
          <div className="effectLumieres">
            <span className="lamp1"></span>
            <span className="lamp2"></span>
            <span className="lamp3"></span>
            <span className="lamp4"></span>
            <span className="lamp5"></span>
            <span className="lamp6"></span>
            <span className="lamp7"></span>
            <span className="lamp8"></span>
            <span className="lamp9"></span>
            <span className="lamp10"></span>
            <span className="lamp11"></span>
            <span className="lamp12"></span>
            <span className="lamp13"></span>
            <span className="lamp14"></span>
            <span className="lamp15"></span>
            <span className="lamp16"></span>
            <span className="lamp17"></span>
            <span className="lamp18"></span>
            <span className="lamp19"></span>
            <span className="lamp20"></span>
            <span className="lamp21"></span>
            <span className="lamp22"></span>
            <span className="lamp23"></span>
            <span className="lamp24"></span>
            <span className="lamp25"></span>
            <span className="lamp26"></span>
            <span className="lamp27"></span>
            <span className="lamp28"></span>
          </div>
        </div>
        <div className="helper2">
          <div className="effectBrush">{/* All the fur spans */}</div>
        </div>
        <div className="helper3">
          <div className="effectBrush">{/* All the fur spans */}</div>
        </div>
        <div className="helper4">
          <div className="effectBrush">{/* All the fur spans */}</div>
        </div>
      </div>
      <iframe
        src="https://www.myinstants.com/media/sounds/netflix-tudum-sfx-n-c.mp3"
        allow="autoplay"
        style={{ display: "none" }}
      >
        <audio
          id="player"
          autoPlay={true}
          src="https://www.myinstants.com/media/sounds/netflix-tudum-sfx-n-c.mp3"
          type="audio/mpeg"
        />
      </iframe>
    </div>
  );
};
export default Start;
