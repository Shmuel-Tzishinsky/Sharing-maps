import * as LucideIcons from "lucide-react";
import { AppConfig } from "#lib/AppConfig";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";

const LayerManagement = ({ mapData, setPickedLocation, layerVisibility, setLayerVisibility }) => {
  const [togglePopup, setTogglePopup] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(mapData.data);
  }, [mapData.data]);

  console.log("🚀 ~ LayerManagement ~ results:", results);

  const [toggleLayersMenu, setToggleLayersMenu] = useState(
    mapData.data.reduce(
      (acc, layer) => ({
        ...acc,
        [layer.category]: false,
      }),
      {}
    )
  );
  const filterMarkers = (searchQuery) => {
    if (!searchQuery) return mapData.data;
    const lowerCaseQuery = searchQuery.toLowerCase();

    return mapData.data.map((item) => {
      return {
        ...item,
        markers: item.markers.filter(
          (marker) =>
            (marker.title && marker.title.toLowerCase().includes(lowerCaseQuery)) ||
            (marker.description && marker.description.toLowerCase().includes(lowerCaseQuery))
        ),
      };
    });
  };

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = filterMarkers(query);
      setResults(searchResults);
    } else {
      setResults(mapData.data);
    }
  }, [query]);

  const toggleAllLayers = (state) => {
    mapData.data.forEach((e, i) => {
      setLayerVisibility((prev) => ({
        ...prev,
        [i]: state,
      }));
    });
  };

  useEffect(() => {
    mapData.data.forEach((e, i) => {
      setLayerVisibility((prev) => ({
        ...prev,
        [i]: true,
      }));
    });
  }, [mapData.data]);

  return (
    <>
      <button
        type="button"
        className="button absolute top-[230px] left-3 rounded bg-white p-2 text-dark shadow-md"
        style={{ zIndex: 999, width: "38px", height: "38px" }}
        onClick={() => setTogglePopup(!togglePopup)}
      >
        <LucideIcons.Layers size={AppConfig.ui.mapIconSize} className="text-blue-500" />
      </button>

      <Dialog
        Dialog
        open={togglePopup}
        onOpenChange={setTogglePopup}
        className="absolute top-0 z-[99999] transition-all duration-200 rounded p-2 text-dark shadow-md bg-white  "
        style={{ left: togglePopup ? "-800px" : "0px" }}
      >
        <DialogContent className="sm:max-w-md w-[300px] left-0 translate-x-0 translate-y-0 top-[58px] h-[calc(100vh_-58px)] flex flex-col  sm:rounded-tl-none">
          <DialogHeader>
            <DialogTitle className="text-right text-lg font-semibold">ניהול שכבות המפה</DialogTitle>
          </DialogHeader>

          <div className="w-full h-full" dir="rtl">
            {mapData.data.length === 0 ? (
              <h2 className="pt-4">אין שכבות זמינות</h2>
            ) : (
              <>
                <div className="flex-1 my-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      placeholder="חפש..."
                      className="w-full p-2 pr-10 border rounded-lg shadow-sm px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      dir="rtl"
                    />
                    <LucideIcons.Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {/* כפתור הצג הכל / הסתר הכל */}

                <div className="w-full my-3 flex flex-row">
                  <button
                    className={`button flex items-center justify-center transition delay-0 ml-2`}
                    onClick={() => {
                      const allSelected = Object.values(layerVisibility).every(
                        (visible) => visible
                      );

                      toggleAllLayers(!allSelected);
                    }}
                  >
                    {Object.values(layerVisibility).every((visible) => visible) ? (
                      <LucideIcons.Eye
                        size={20}
                        className="text-[#000] rotate-0"
                        // style={{ strokeWidth: 4 }}
                      />
                    ) : (
                      <LucideIcons.EyeClosed
                        size={20}
                        className="text-[#000] rotate-0"
                        // style={{ strokeWidth: 4 }}
                      />
                    )}
                  </button>
                  <p>
                    {Object.values(layerVisibility).every((visible) => visible)
                      ? "הסתר את התוכן"
                      : "הצג את התוכן"}
                  </p>
                </div>
                <div className="h-[75%] overflow-auto pb-3">
                  {results.map((layer, index) => {
                    const IconComponent =
                      layer.icon && LucideIcons[layer.icon]
                        ? LucideIcons[layer.icon]
                        : LucideIcons.MapPin;

                    return (
                      <div
                        className="mb-3 overflow-hidden transition-all"
                        key={index}
                        style={{
                          height:
                            toggleLayersMenu[layer.category] || query.length >= 2 ? "auto" : "36px",
                          transitionDuration: "3000ms",
                        }}
                      >
                        <div
                          key={index}
                          className="flex items-center bg-[#f0efef] justify-between mb-0 p-2 rounded-lg hover:bg-blue-100 transition "
                        >
                          <div className="flex  items-center justify-end">
                            <button
                              className={`button flex items-center justify-center transition delay-0  duration-300 ml-2`}
                              onClick={() =>
                                setLayerVisibility((prev) => ({
                                  ...prev,
                                  [index]: !prev[index],
                                }))
                              }
                            >
                              {layerVisibility[index] ? (
                                <LucideIcons.Eye
                                  size={20}
                                  className="text-[#000] rotate-0"
                                  // style={{ strokeWidth: 4 }}
                                />
                              ) : (
                                <LucideIcons.EyeClosed
                                  size={20}
                                  className="text-[#000] rotate-0"
                                  // style={{ strokeWidth: 4 }}
                                />
                              )}
                            </button>
                            {/* אייקון שכבה */}
                            <div className="flex items-center gap-2">
                              {layer.icon && layer.color && (
                                <div
                                  className="w-5 h-5 rounded-sm flex items-center justify-center shadow-md"
                                  style={{
                                    backgroundColor: layer.background,
                                    color: layer.color,
                                    opacity: layerVisibility[index] ? 1 : 0.4,
                                  }}
                                >
                                  <IconComponent
                                    className="w-4 h-4"
                                    style={{ color: layer.color }}
                                  />
                                </div>
                              )}
                              <span
                                className={`text-sm mr-2 ${
                                  !layerVisibility[index]
                                    ? "text-[gray] font-medium"
                                    : " text-[black] font-bold"
                                }`}
                              >
                                {layer.category} ({layer.markers.length})
                              </span>
                            </div>
                          </div>
                          <button
                            className={`flex items-center justify-center`}
                            onClick={() =>
                              setToggleLayersMenu((prevState) => {
                                console.log("Previous state:", prevState);
                                return {
                                  ...prevState,
                                  [layer.category]: !prevState[layer.category],
                                };
                              })
                            }
                          >
                            <LucideIcons.ChevronUp
                              size={20}
                              className="text-[#000] transition-all"
                              style={{
                                strokeWidth: 4,
                                transform: `rotate(${
                                  toggleLayersMenu[layer.category] || query.length >= 2 ? 180 : 0
                                }deg)`,
                                transitionDuration: "300ms",
                              }}
                            />
                          </button>
                        </div>

                        {layer.markers.map((mar, i) => (
                          <div
                            key={i}
                            className="w-full flex items-center justify-start py-1 rounded-sm px-1"
                            style={{
                              background: i % 2 !== 0 ? "#ebeef1" : "#fff",
                            }}
                          >
                            <button
                              className={`button flex items-center justify-center ml-2`}
                              onClick={() => setPickedLocation(mar)}
                            >
                              <LucideIcons.SearchX size={12} />
                            </button>
                            {/* אייקון שכבה */}
                            <div className="flex items-center gap-2">
                              {layer.icon && layer.color && (
                                <div
                                  className="w-5 h-5 rounded-sm flex items-center justify-center shadow-md"
                                  style={{
                                    backgroundColor: layer.background,
                                    color: layer.color,
                                    opacity: layerVisibility[index] ? 1 : 0.4,
                                  }}
                                >
                                  <IconComponent
                                    className="w-4 h-4"
                                    style={{ color: layer.color }}
                                  />
                                </div>
                              )}
                              <span
                                className={`text-sm mr-2 ${
                                  !layerVisibility[index]
                                    ? "text-[gray] font-medium"
                                    : " text-[black] font-bold"
                                }`}
                              >
                                {mar.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LayerManagement;
