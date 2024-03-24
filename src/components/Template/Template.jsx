import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import painlist from "../../utils/painlist.json";
import "./Template.css";

const Template = (props) => {
  const [painName, setPainName] = useState("");

  const painNames = () => {
    setPainName(props.search);
    // console.log("SearchValue ", props.search);
  };

  useEffect(() => {
    painNames();
  }, [props.search]);
  return (
    <div className="template_section">
      <div className="template_top">
        <div className="template_left">
          <span style={{ textTransform: "uppercase" }}>Pain Cards</span>
          {/*<Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "50px" }}
          >
            Add Category
          </Button>*/}
        </div>

        <div className="templete_right">
          {/* <div className="gallery_button">
                    Template Gallery 
                    <UnfoldMoreIcon />
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div> */}
        </div>
      </div>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="template_body"
      >
        {painlist
          .filter((painlist) => {
            return painName.toLowerCase() === ""
              ? painlist
              : painlist.title.toLowerCase().split(" ").includes(painName);
          })
          .map((pain, i) => {
            return (
              <Link to={"/form/" + pain.id} className="link">
                <div className="card1" key={i}>
                  <img src={pain.image} alt="" className="card_image" />
                  <span className="card_title">{pain.title}</span>
                </div>
              </Link>
            );
          })}
      </motion.div>
    </div>
  );
};
export default Template;
