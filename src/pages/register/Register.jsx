import React from "react";
import { useRef } from "react";
import { useState } from "react";
import "./register.scss";
import axios from "axios";
import logins from "../../assets/logo.png";
import part1 from "../../assets/part1.png";
import part2 from "../../assets/part2.jpg";
import part3 from "../../assets/part3img.png";
import part4 from "../../assets/part4.png";
import part3vid from "../../assets/part3video.m4v";
import netfliximg from "../../assets/NG-en-20230403-popsignuptwoweeks-perspective_alpha_website_small.jpg";
import box from "../../assets/boxshot.png";
import vids from "../../assets/video-tv-0819.m4v";
// import trail1 from "../../assets/The Imperfects _ Official Trailer _ Netflix.mp4";

import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const history = useHistory();

  const emailRef = useRef();

  const Email1 = () => {
    const FloatLabel = (() => {
      // add active class and placeholder
      const handleFocus = (e) => {
        const target = e.target;
        target.parentNode.classList.add("active");
        target.setAttribute(
          "placeholder",
          target.getAttribute("data-placeholder")
        );
      };

      // remove active class and placeholder
      const handleBlur = (e) => {
        const target = e.target;
        if (!target.value) {
          target.parentNode.classList.remove("active");
        }
        target.removeAttribute("placeholder");
      };

      // register events
      const bindEvents = (element) => {
        const floatField = element.querySelector("input");
        floatField.addEventListener("focus", handleFocus);
        floatField.addEventListener("blur", handleBlur);
      };

      // get DOM elements
      const init = () => {
        const floatContainers = document.querySelectorAll(".float-container");

        floatContainers.forEach((element) => {
          if (element.querySelector("input").value) {
            element.classList.add("active");
          }

          bindEvents(element);
        });
      };

      return {
        init: init,
      };
    })();

    FloatLabel.init();
  };

  const handleStart = () => {
    setEmail(emailRef.current.value);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    console.log(password);
    const regd = { email, username, password };
    console.log(regd);
    axios.post("http://localhost:8800/auth/register", regd);
    history.push("/login");
  };
  return (
    <div className="register1" onLoad={Email1}>
      <div className="container1">
        <div className="head">
          <img src={logins} alt="" />
          <select class="form-select" id="languages" name="languages">
            <option value="">languages</option>
            <option value="af">Afrikaans</option>
            <option value="sq">Albanian - shqip</option>
            <option value="am">Amharic - አማርኛ</option>
            <option value="ar">Arabic - العربية</option>
          </select>
          <Link className="sign" to="login">
            Sign In
          </Link>
        </div>
      </div>
      <div className="container">
        <div className="maxv">
          <div className="img-fit">
            <img
              alt="banner"
              className="fit"
              src={netfliximg}
              srcset="https://assets.nflxext.com/ffe/siteui/vlv3/f1c3c4eb-2fea-42c7-9ebd-1c093bd8a69d/5b6cb1ca-7390-4e73-90f7-f291ee7bba80/NG-en-20230403-popsignuptwoweeks-perspective_alpha_website_small.jpg 600w, https://assets.nflxext.com/ffe/siteui/vlv3/f1c3c4eb-2fea-42c7-9ebd-1c093bd8a69d/5b6cb1ca-7390-4e73-90f7-f291ee7bba80/NG-en-20230403-popsignuptwoweeks-perspective_alpha_website_medium.jpg 1100w, https://assets.nflxext.com/ffe/siteui/vlv3/f1c3c4eb-2fea-42c7-9ebd-1c093bd8a69d/5b6cb1ca-7390-4e73-90f7-f291ee7bba80/NG-en-20230403-popsignuptwoweeks-perspective_alpha_website_large.jpg 1400w"
            />
            <div className="default-div"></div>
          </div>
          <div className="box">
            <div className="heading">
              <h1>Unlimited movies, TV shows and more.</h1>
              <p>Watch anywhere. Cancel anytime.</p>
              <h3>
                Ready to watch? Enter your email to create or restart your
                membership.
              </h3>
            </div>
            {!email ? (
              <div className="Email">
                <div id="floatContainer1" className="float-container">
                  <label htmlFor="floatField1">Enter Email</label>
                  <input
                    type="email"
                    id="floatField1"
                    data-placeholder=""
                    autoComplete="email"
                    minLength="5"
                    maxLength="50"
                    ref={emailRef}
                  />
                </div>
                <Link onClick={handleStart}>Get Started </Link>
              </div>
            ) : (
              <form className="Password" onSubmit={handleFinish}>
                <div id="floatContainer1" className="float-container">
                  <label htmlFor="floatField1">Enter Username</label>
                  <input
                    type="text"
                    id="floatField1"
                    data-placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div id="floatContainer1" className="float-container">
                  <label htmlFor="floatField1">Enter Password</label>
                  <input
                    type="password"
                    id="floatField1"
                    data-placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button>Start</button>
              </form>
            )}
          </div>
        </div>
        <div className="border"></div>
      </div>
      <div className="card-1">
        <div className="card-flex">
          <div className="desc-1">
            <h1>Enjoy on your TV.</h1>
            <p>
              Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
              Blu-ray players and more.
            </p>
          </div>
          <div className="img-vid">
            <div className="img1">
              <img src={part1} alt="" />
              <div className="vid1">
                <video src={vids} playsInline muted autoPlay={true} loop />
              </div>
            </div>
          </div>
        </div>
        <div className="border"></div>
      </div>
      <div className="card-2">
        <div className="img-cont">
          <img src={part2} className="part2" alt="img" />
          <div className="load-cont">
            <img src={box} alt="" />
            <div className="animation">
              <div className="text">Stranger Things</div>
              <div className="texts">Downloading...</div>
            </div>
            <div className="loads"></div>
          </div>
        </div>
        <div className="desc-2">
          <h1>Download your shows to watch offline.</h1>
          <p>Save your favourites easily and always have something to watch.</p>
        </div>
        <div className="card-flex"></div>
        <div className="border"></div>
      </div>
      <div className="card-1">
        <div className="card-flex">
          <div className="desc-1">
            <h1>Watch everywhere.</h1>
            <p>
              Stream unlimited movies and TV shows on your phone, tablet,
              laptop, and TV.
            </p>
          </div>
          <div className="img-vid">
            <div className="img1">
              <img src={part3} alt="" />
              <div className="vid2">
                <video src={part3vid} playsInline muted autoPlay={true} loop />
              </div>
            </div>
          </div>
        </div>
        <div className="border"></div>
      </div>
      <div className="card-1">
        <div className="card-flex">
          <div className="desc-1">
            <h1>Create profiles for kids.</h1>
            <p>
              Send kids on adventures with their favorite characters in a space
              made just for them—free with your membership.
            </p>
          </div>
          <div className="img-vid">
            <div className="img1">
              <img src={part4} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
