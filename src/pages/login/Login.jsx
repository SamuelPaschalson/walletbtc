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
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    history.push("/start");
    localStorage.setItem("user", true);
    setUser(true);
  };

  return (
    <div className="login-page">
      <div className="background-image">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/a927b1ee-784d-494a-aa80-cf7a062d2523/web/NG-en-20250714-TRIFECTA-perspective_1133c85c-2844-4ce9-a1ab-d0d7244351d9_small.jpg"
          alt=""
        />
      </div>

      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src={Logins}
            loading="lazy"
            role="presentation"
            alt="Netflix logo"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="form-container">
          <div className="login-content">
            <h1>Sign In</h1>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email or mobile number</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
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

              <div className="sign-in-options">
                <div className="divider">
                  <span>OR</span>
                </div>
                <button type="button" className="sign-in-code">
                  Use a Sign-In Code
                </button>
              </div>

              <div className="forgot-password">
                <Link to="/forgot">Forgot password?</Link>
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
            <div className="contact">Questions? Contact us.</div>
            <div className="footer-links">
              <div
                style={{
                  margin: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <a href="#">FAQ</a>
                <a href="#">Cookie Preferences</a>
              </div>
              <div
                style={{
                  margin: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <a href="#">Help Center</a>
                <a href="#">Corporate Information</a>
              </div>
              <a href="#" style={{ margin: "20px", marginTop: 0 }}>
                Terms of Use
              </a>
              <a href="#" style={{ margin: "20px", marginTop: 0 }}>
                Privacy
              </a>
            </div>
            <div className="language-selector">
              <select
                name=""
                id=""
                style={{ margin: "20px", marginTop: 0, color: "#fff" }}
              >
                <option>English</option>
              </select>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
