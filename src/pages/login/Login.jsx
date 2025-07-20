import "./login.scss";
import React from "react";
import Logins from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import netfliximg from "../../assets/login.png";
import { useHistory } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    history.push("/start");
    localStorage.setItem("user", true);
    setUser(true);
  };

  return (
    <div className="login-page">
      <div className="background-image">
        <img src={netfliximg} alt="Netflix background" />
      </div>

      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src={Logins}
            loading="lazy"
            alt="Netflix logo"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="form-container">
          <div className="login-content">
            <h1 style={{ color: "#fff" }}>Sign In</h1>
            <form onSubmit={handleLogin}>
              {/* Form inputs remain the same */}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Sign In
              </button>

              <div className="login-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/help" className="help-link">
                  Need help?
                </Link>
              </div>

              <div className="signup-redirect">
                <span>New to Netflix? </span>
                <Link to="/register">Sign up now.</Link>
              </div>

              <div className="recaptcha-notice">
                <p>
                  This page is protected by Google reCAPTCHA to ensure you're
                  not a bot.{" "}
                  <button type="button" className="learn-more">
                    Learn more.
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        <footer className="login-footer">
          <div className="footer-content">
            <div className="contact">Questions? Call 1-844-505-2993</div>
            <div className="footer-links">
              <div className="link-column">
                <a href="#">FAQ</a>
                <a href="#">Help Center</a>
                <a href="#">Netflix Shop</a>
                <a href="#">Terms of Use</a>
              </div>
              <div className="link-column">
                <a href="#">Privacy</a>
                <a href="#">Cookie Preferences</a>
                <a href="#">Corporate Information</a>
                <a href="#">Do Not Sell or Share My Personal Information</a>
              </div>
              <div className="link-column">
                <a href="#">Ad Choices</a>
              </div>
            </div>
            <div className="language-selector">
              <select>
                <option>English</option>
                {/* Add other language options as needed */}
              </select>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
