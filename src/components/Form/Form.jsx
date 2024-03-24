import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionForm from "../QuestionForm/QuestionForm";
import Sidebar from "../Sidebar/Sidebar";
import Centeredtabs from "../Tabs/Tabs";
import "./Form.css";

const Form = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://docback.hasthiya.org/category/getCategoryByID/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [id]);

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
        <div className="form_header_right"> </div>
      </div>
      <div>
        <Centeredtabs paramId={id} />

        <motion.div
          animate={{ opacity: 3 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="form_bottom"
        >
          <QuestionForm paramId={id} />
        </motion.div>
      </div>
    </>
  );
};

export default Form;
