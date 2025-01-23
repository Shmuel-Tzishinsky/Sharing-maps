import LatLngLogo from "#components/TopBar/LatLngLogo";
import { NavMenuVariant } from "#lib/AppConfig";
import NavMenu from "#components/common/NavMenu";
import MapViewer from "#components/MapViewer";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GptTest() {
  const router = useRouter();
  const { mapId } = router.query;

  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    if (mapId) {
      fetch(`/api/maps/${mapId}`)
        .then((data) => data.json())
        .then((text) => {
          console.log("🚀 ~ .then ~ text:", text);
          const key = "אטרקציה.geojson";
          const blobContent = JSON.parse(text.geojson[key].fileContent);
          console.log("🚀 ~ .then ~ blobContent:", blobContent);

          try {
            setGeoJsonData(blobContent);
          } catch (err) {
            console.error("Error parsing blob content:", err);
          }
        })
        .catch((error) => console.error("Error fetching GeoJSON:", error));
    }
  }, [mapId]);

  if (!mapId) return <h1 style={{ textAlign: "center" }}>No query found</h1>;
  if (!geoJsonData) return <p>Loading map...</p>;

  return (
    <div className="gpt-test">
      <div
        className="left-0 top-0 flex h-20 w-full items-center bg-dark p-3 shadow"
        style={{ zIndex: 1000 }}
      >
        <div className="flex w-full justify-between">
          <LatLngLogo />
          <div className="flex flex-col justify-center">
            <NavMenu variant={NavMenuVariant.TOPNAV} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h1>Map Viewer</h1>
        <MapViewer geoJsonData={geoJsonData} />
      </div>
    </div>
  );
}
