import React, { useState } from "react";
import Header from "../components/Header/Header";
import Template from "../components/Template/Template";

const Components = () => {
  const [search, setSearch] = useState("");
  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <Template search={search} />
    </div>
  );
};

export default Components;
