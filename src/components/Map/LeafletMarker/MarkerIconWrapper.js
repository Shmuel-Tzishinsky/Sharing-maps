import { useMemo } from "react";

import * as LucideIcons from "lucide-react";
import { AppConfig } from "#lib/AppConfig";

const MarkerIconWrapper = ({ icon, color, background, label, isPopUp }) => {
  const IconComponent = icon && LucideIcons[icon] ? LucideIcons[icon] : LucideIcons.MapPin;
  return (
    <div className="relative inline-flex p-0 m-[-22px_0px_0_1px]">
      {label && (
        <span
          className="absolute -inset-2 rounded-full opacity-40"
          style={{ backgroundColor: background }}
        />
      )}

      {isPopUp ? (
        <div
          className="relative inline-block rounded-full bg-primary p-2 text-white"
          style={{ backgroundColor: background }}
        >
          <IconComponent
            style={{
              color: color,
              width: AppConfig.ui.markerIconSize,
              height: AppConfig.ui.markerIconSize,
            }}
          />
          {label && (
            <span className="absolute -top-2 -right-2 flex h-7 w-7 flex-col items-center rounded-full border-2 border-white bg-error pt-1 text-xs">
              {label}
            </span>
          )}
        </div>
      ) : (
        <svg width="30" height="38" viewBox="0 0 40 48">
          <path
            d="M20 0C9 0 0 9 0 20C0 31 20 48 20 48C20 48 40 31 40 20C40 9 31 0 20 0Z"
            fill={background}
          />
          <path
            // xmlns="http://www.w3.org/2000/svg"
            d="M 20 2 C 10.375 2 2.5 10.062 2.5 19.917 C 2.5 29.771 20 45 20 45 C 20 45 37.5 29.771 37.5 19.917 C 37.5 10.062 29.625 2 20 2 Z"
            fill={background}
            stroke={color || "#fff"}
          />
          {/* מיכל לאייקון במרכז הטיפה */}
          <foreignObject x="8" y="8" width="24" height="24">
            <div className="h-full w-full flex items-center justify-center">
              <IconComponent
                style={{
                  color: color,
                  width: AppConfig.ui.markerIconSize,
                  height: AppConfig.ui.markerIconSize,
                }}
              />
            </div>
          </foreignObject>

          {/* התווית, אם יש */}
          {label && (
            <g transform="translate(24, 0)">
              <circle r="10" fill="white" stroke={background} strokeWidth="2" />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={background}
                fontSize="12"
              >
                {label}
              </text>
            </g>
          )}

          {label && (
            <span className="absolute -top-2 -right-2 flex h-7 w-7 flex-col items-center rounded-full border-2 border-white bg-error pt-1 text-xs">
              {label}
            </span>
          )}
        </svg>
      )}
      <span className={`absolute ${label ? "-inset-2" : "-inset-1"} rounded-full`} />
    </div>
  );
};

export default MarkerIconWrapper;
