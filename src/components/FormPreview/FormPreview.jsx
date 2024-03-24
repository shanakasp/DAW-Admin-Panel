import { motion } from "framer-motion";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Question from "../Questions/Question";
import Sidebar from "../Sidebar/Sidebar";
import Centeredtabs from "../Tabs/Tabs";
import "./FormPreview.css";
const FormPreview = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="form_header">
        <div className="form_header_left">
          <Sidebar />
          <img
            src=".././images/medical.png"
            alt=""
            className="header_logo"
            width={"150px"}
          />
        </div>
      </div>
      <div>
        <Centeredtabs paramId={params.id} />
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="form_bottom"
        >
          <Question paramId={params.id} />
        </motion.div>
      </div>
    </>
  );
};

export default FormPreview;
