import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

export default function MapViewer({ geoJsonData }) {
  console.log("🚀 ~ MapViewer ~ geoJsonData:", geoJsonData);

  // geoJsonData.text().then((text) => {
  //   try {
  //     const geoJson = JSON.parse(text); // המרה מ-טקסט ל-JSON
  //     console.log("🚀 ~ MapViewer ~ geoJson:", geoJson);
  //     setGeoJsonData(geoJson); // שמירה במצב
  //   } catch (error) {
  //     console.error("Invalid GeoJSON format:", error);
  //   }
  // }); // קריאה של תוכן הקובץ כטקסט
  // console.log("🚀 ~ MapViewer ~ text:", text);

  return (
    <Map center={[0, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png?lang=he"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geoJsonData} />
    </Map>
  );
}
