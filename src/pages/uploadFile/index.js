import React, { useState } from "react";
import MapInterface from "../map/MapInterface";

const index = () => {
  const [mapData, setMapData] = useState({
    name: "ערוך את שם המפה",
    description: "",
    data: [],
  });

  return <MapInterface {...{ mapData, setMapData }} />;
};

export default index;
