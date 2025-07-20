import React, { useState, useRef, useEffect } from "react";
import "./list.scss";
import ListItem from "../listItem/ListItem";
import TopTen from "../topten/TopTen"; // Import the TopTen component
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { motion } from "framer-motion";
import Preview from "../preview/preview";

export default function List({ list }) {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const listRef = useRef();

  // Sort the list by rowPosition before rendering
  const sortedContent = [...list.content].sort((a, b) => {
    const posA = a.rowPosition !== undefined ? a.rowPosition : 0;
    const posB = b.rowPosition !== undefined ? b.rowPosition : 0;
    return posA - posB;
  });

  const handleClick = (direction) => {
    setIsMoved(true);
    let distance = listRef.current.getBoundingClientRect().x - 50;

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }

    if (direction === "right" && slideNumber < 10) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  };

  // Netflix-style row hover effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowControls(true);
      } else {
        setShowControls(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ order: list.rowPosition || 0 }}
    >
      <span className="listTitle">{list.title}</span>
      <div className="wrapper">
        <ArrowBackIos
          className="sliderArrow left"
          onClick={() => handleClick("left")}
          style={{ display: !isMoved && "none" }}
        />

        <div className="container" ref={listRef}>
          {sortedContent.map((item, index) =>
            list.category === "top10" ? (
              <TopTen key={item._id} index={index} item={item} />
            ) : (
              <ListItem
                key={item._id}
                index={index}
                item={item}
                totalItems={item.length}
                setShowPreview={setShowPreview}
                setPreviewData={setPreviewData}
              />
            )
          )}
        </div>

        <ArrowForwardIos
          className="sliderArrow right"
          onClick={() => handleClick("right")}
        />
      </div>
      {showPreview && previewData && (
        <Preview
          item={previewData}
          onClose={() => setShowPreview(false)}
          // Pass any additional props your Preview component needs
        />
      )}
    </motion.div>
  );
}
