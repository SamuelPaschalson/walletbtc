import React from "react";
import "./profile.scss";
import { Link } from "react-router-dom";
import netflixLogo from "../../assets/logo.png";
import CirclePlus from "../../assets/CirclePlus.svg";

const Profile = () => {
  const profileList = [
    {
      img_src:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      username: "Emenalo",
    },
    {
      img_src:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      username: "Emenalo",
    },
    {
      img_src:
        "https://i.pinimg.com/564x/1b/a2/e6/1ba2e6d1d4874546c70c91f1024e17fb.jpg",
      username: "Onyeka",
    },
    {
      img_src:
        "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
      username: "Kids",
      isKid: true,
    },
  ];

  return (
    <div className="profile-container">
      <div className="header">
        <img src={netflixLogo} alt="Netflix Logo" className="logo" />
      </div>

      <div className="profile-content">
        <h1 className="title">Who's watching?</h1>
        <div className="profiles-list">
          {profileList.map((profile, index) => (
            <div key={index} className="profile-item">
              <Link
                to={{
                  pathname: "/",
                  state: { img: profile.img_src },
                }}
              >
                <div
                  className={`profile-avatar ${
                    profile.isKid ? "kid-profile" : ""
                  }`}
                >
                  <img
                    src={profile.img_src}
                    alt={profile.username}
                    loading="lazy"
                  />
                  {profile.isKid && <span className="kid-badge">Kids</span>}
                </div>
                <span className="profile-name">{profile.username}</span>
              </Link>
            </div>
          ))}
          <div className="profile-item">
            <div className="profile-add">
              <img src={CirclePlus} alt="Add Profile" loading="lazy" />
            </div>
            <span className="profile-name">Add Profile</span>
          </div>
        </div>
        <div className="profile-footer">
          <button className="manage-button">Manage Profiles</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
