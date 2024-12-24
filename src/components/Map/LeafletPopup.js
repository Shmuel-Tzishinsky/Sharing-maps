import { ChevronLeft, ChevronRight, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Popup } from "react-leaflet";

import { AppConfig } from "#lib/AppConfig";

const MarkerIconWrapper = dynamic(() => import("#components/Map/LeafletMarker/MarkerIconWrapper"));
const Button = dynamic(() => import("#components/common/Button"));

const LeafletPopup = ({ handlePopupClose, handleOpenLocation, color, icon, item, ...props }) => {
  const { title, address } = item;

  return (
    <Popup {...props}>
      <div
        className="absolute rounded-md bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
        style={{
          // todo: rework the offsets at some point
          marginLeft: `calc(-150px + ${AppConfig.ui.markerIconSize - 5}px)`,

          // todo: some offest to align with the marker icon
          marginTop: -1,
        }}
      >
        <div className="flex flex-row justify-center pt-3" style={{ width: "300px" }}>
          <Button
            className="absolute right-3 top-3 inline-block text-dark"
            onClick={() => handlePopupClose(false)}
            small
          >
            <X size={AppConfig.ui.markerIconSize} />
          </Button>
          <div className="absolute left-0 top-0 mt-5 flex w-full justify-center">
            <MarkerIconWrapper color={color} icon={icon} />
          </div>
          <div
            className="flex w-full flex-col justify-center p-3 pt-6 text-center"
            style={{ marginTop: AppConfig.ui.markerIconSize * 2 + 8 }}
          >
            <h3 className="m-0 text-lg font-bold leading-none">{title}</h3>
            <p className="m-0 text-secondary">{address}</p>
            {/* todo: new component for button group */}
            <div className="mt-6 flex flex-row justify-between gap-2 p-2">
              <Button
                className="gap-2 bg-secondary text-white"
                onClick={() => handlePopupClose()}
                small
              >
                <ChevronLeft size={AppConfig.ui.menuIconSize} />
                Close
              </Button>
              <Button
                className="gap-2 bg-primary text-white"
                onClick={() => handleOpenLocation()}
                small
              >
                Open
                <ChevronRight size={AppConfig.ui.menuIconSize} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default LeafletPopup;
