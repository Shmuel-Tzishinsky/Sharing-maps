import LatLngLogo from "#components/TopBar/LatLngLogo";
import { NavMenuVariant } from "#lib/AppConfig";
import NavMenu from "#components/common/NavMenu";
import MapViewer from "#components/MapViewer";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MapPage from "../map";

export default function GptTest() {
  const router = useRouter();
  const { id } = router.query;
  console.log("🚀 ~ GptTest ~ id:", id);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/maps/${id}`)
        .then((data) => data.json())
        .then((text) => {
          console.log("🚀 ~ .then ~ text:", text);
          try {
            setData(text);
          } catch (err) {
            console.error("Error parsing blob content:", err);
          }
        })
        .catch((error) => console.error("Error fetching GeoJSON:", error));
    }
  }, [id]);

  if (!id) return <h1 style={{ textAlign: "center" }}>No query found</h1>;
  if (!data) return <p>Loading map...</p>;

  return (
    <div className="gpt-test">
      <MapPage data={data} />
    </div>
  );
}
