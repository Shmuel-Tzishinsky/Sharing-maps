import { useRouter } from "next/router";
import MapViewer from "../../components/MapViewer";
import { useEffect, useState } from "react";

const MapPage = () => {
  const router = useRouter();
  const { mapId } = router.query;
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    if (mapId) {
      fetch(`/api/maps/${mapId}`)
        .then((res) => res.json())
        .then((data) => setGeoJsonData(data.geojson));
    }
  }, [mapId]);

  if (!geoJsonData) return <p>Loading map...</p>;

  return (
    <div>
      <h1>Map Viewer</h1>
      <MapViewer geoJsonData={geoJsonData} />
    </div>
  );
};

export default MapPage;
