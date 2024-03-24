import React, { useState } from "react";

import Header from "../components/Header/Header";
import Mainbody from "../components/MainBody/Mainbody";
const Homepage = () => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      {/* <Template search={search}/> */}
      <Mainbody />
    </div>
  );
};

export default Homepage;
