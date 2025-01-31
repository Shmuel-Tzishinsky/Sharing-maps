import Head from "next/head";
import { useEffect, useState } from "react";
import MapInterface from "./MapInterface";

const MapPage = ({ data }) => {
  console.log("🚀 ~ MapPage ~ data:", data);
  const [mapData, setMapData] = useState(
    data || {
      name: "ערוך את שם המפה",
      description: "",
      data: [],
    }
  );

  return (
    <div>
      <Head>
        <title>
          Map Example | Jumpstart your new leaflet mapping Project with next.js and typescript 🤩
        </title>
        <meta
          property="og:title"
          content="Map Example | Jumpstart your new leaflet mapping Project with next.js and typescript 🤩"
          key="title"
        />
        <meta
          name="description"
          content="next-leaflet-starter-typescript is an extensible next.js starter template for the leaflet-maps-react plugin. Written in typescript,
      visually enhanced by tailwind and lucide-react icons."
        />
      </Head>
      <MapInterface {...{ mapData, setMapData }} />
    </div>
  );
};

export default MapPage;
