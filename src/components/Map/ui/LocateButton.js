import { LocateFixed } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AppConfig } from "#lib/AppConfig";
import { CustomMarker } from "../LeafletMarker";
import useMapContext from "../useMapContext";

export const LocateButton = () => {
  const { map } = useMapContext();
  const [userPosition, setUserPosition] = useState(undefined);

  const handleClick = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // הצלחה
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        // טיפול בשגיאות ספציפיות
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("אשר גישה למיקום");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("מיקום לא זמין");
            break;
          case error.TIMEOUT:
            alert("חיפוש מיקום הסתיים בטיימאאוט");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (userPosition) {
      map?.flyTo(userPosition);
    }
  }, [map, userPosition]);

  return (
    <>
      <button
        type="button"
        style={{ zIndex: 400 }}
        className="button absolute top-[140px] left-3 rounded bg-white p-2 text-dark shadow-md"
        onClick={() => handleClick()}
      >
        <LocateFixed size={AppConfig.ui.mapIconSize} />
      </button>
      {userPosition && (
        <CustomMarker
          place={{
            id: 0,
            title: "Your location",
            address: "You are here",
            position: userPosition,
          }}
          color={"#fff"}
          background={"#333"}
          icon={"MapPin"}
        />
      )}
    </>
  );
};
