import React from "react";
import Featured from "../../components/featured/Featured";
import List from "../../components/list/List";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./home.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const location = useLocation();

  const [genre, setGenre] = useState(null);

  useEffect(() => {
    const getRandomList = async () => {
      try {
        const res = await axios.get(
          `https://whatsappbot-1-e6rt.onrender.com/api/list${
            type ? "?type=" + type : ""
          }`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        setLists(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomList();
  }, [type, genre]);

  return (
    <div className="home">
      <Navbar img={location?.state?.img} />
      <div className="content-container">
        <Featured type={type} setGenre={setGenre} />
        <div className="lists">
          {lists.map((list, index) => (
            <List
              key={index}
              list={list}
              // setShowPreview={setShowPreview}
              // setPreviewData={setPreviewData}
            />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
