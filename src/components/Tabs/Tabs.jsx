import { Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tabs.css";

const Centeredtabs = (props) => {
  const navigate = useNavigate();
  return (
    <Paper className="root" elevation={3} square>
      <Tabs className="tabs" label="Questions" textColor="primary" centered>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Tab
            className="tab"
            label="Questions"
            style={{
              fontSize: "15px",
              borderRadius: "5px",
              marginRight: "20px",
              flex: 1, // Set flex property to distribute remaining space equally
              boxShadow: "0 2px 5px", // Add box shadow
            }}
            onClick={() => {
              navigate(`/form/${props.paramId}`);
            }}
          />
          <Tab
            className="tab"
            label="Preview"
            style={{
              fontSize: "15px",
              borderRadius: "5px",
              flex: 1, // Set flex property to distribute remaining space equally
              boxShadow: "0 2px 5px", // Add box shadow
            }}
            onClick={() => {
              navigate(`/preview/${props.paramId}`);
            }}
          />
        </div>
        ;
      </Tabs>
    </Paper>
  );
};

export default Centeredtabs;
