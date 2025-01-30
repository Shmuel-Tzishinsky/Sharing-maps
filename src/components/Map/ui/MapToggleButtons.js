import { LocateFixed, Focus, Shrink, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppConfig } from "#lib/AppConfig";
import { CustomMarker } from "../LeafletMarker";
import useMapContext from "../useMapContext";
import { useMapEvents } from "react-leaflet";

export const MapToggleButtons = ({ centerPos, minZoom }) => {
  const { map } = useMapContext();
  const [userPosition, setUserPosition] = useState(undefined);
  const [showLocate, setShowLocate] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const handleLocationClick = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setShowLocate(false);
      },
      (error) => {
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

  const handleCenterClick = useCallback(() => {
    if (!isTouched || !map) return;
    map?.flyTo(centerPos, minZoom);
    map.once("moveend", () => {
      setIsTouched(false);
    });
    setShowLocate(true);
    setUserPosition(undefined);
  }, [map, isTouched, minZoom, centerPos]);

  useEffect(() => {
    if (userPosition) {
      map?.flyTo(userPosition);
    }
  }, [map, userPosition]);

  const touch = useCallback(() => {
    if (!isTouched && map) {
      setIsTouched(true);
    }
  }, [isTouched, map]);

  useMapEvents({
    move() {
      touch();
    },
    zoom() {
      touch();
    },
  });

  return (
    <>
      <button
        type="button"
        style={{ zIndex: 400, width: "38px", height: "38px" }}
        className="button absolute top-[130px] left-3 rounded bg-white p-2 text-dark shadow-md"
        onClick={showLocate ? handleLocationClick : handleCenterClick}
      >
        {showLocate ? (
          <LocateFixed size={AppConfig.ui.mapIconSize} className="text-blue-500" />
        ) : (
          <>
            <MapPin
              size={AppConfig.ui.mapIconSize / 1.3}
              className={`absolute top-[11px] text-blue-500`}
              style={{ left: `${5}px`, fill: "#fff", transform: "rotate(-6deg)" }}
            />
            <MapPin
              size={AppConfig.ui.mapIconSize / 1.3}
              className={`absolute top-[11px] text-blue-500`}
              style={{ left: `${11}px`, fill: "#fff" }}
            />
            <MapPin
              size={AppConfig.ui.mapIconSize / 1.3}
              className={`absolute top-[11px] text-blue-500`}
              style={{ left: `${17}px`, fill: "#fff", transform: "rotate(12deg)" }}
            />
          </>
        )}
      </button>
      {userPosition && (
        <CustomMarker
          place={{
            id: 0,
            title: "Your location",
            address: "You are here",
            position: userPosition,
          }}
          showLabelInAll={false}
          dirLabel={""}
          color={"#fff"}
          background={"#333"}
          icon={"MapPin"}
        />
      )}
    </>
  );
};
