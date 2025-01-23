import React, { useCallback, useEffect, useRef, useState } from "react";

import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";
import FileUploadDialog from "#components/ui/FileUploadDialog ";
import Map from "#components/MapUpload";
import LayerCustomization from "#components/ui/LayerCustomization";
import SearchAutocomplete from "#components/ui/SearchAutocomplete";

const MapInterface = () => {
  const [showAdminLayerCard, setShowAdminLayerCard] = useState(true);
  const [showFilterLayerCard, setShowFilterLayerCard] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [mapName, setMapName] = useState("שם המפה");
  const [mapDescription, setMapDescription] = useState("");
  const [data, setData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLayerCustomizationOpen, setIsLayerCustomizationOpen] = useState(null);
  const handleSave = useCallback(
    () => () => {
      setIsModalOpen(false);
    },
    []
  );
  // New state to track layer visibility
  const [layerVisibility, setLayerVisibility] = useState(
    data.reduce((acc, layer, index) => {
      acc[index] = true; // Default all layers to visible
      return acc;
    }, {})
  );

  const toggleAllLayers = (state) => {
    data.forEach((e, i) => {
      setLayerVisibility((prev) => ({
        ...prev,
        [i]: state,
      }));
    });
  };

  useEffect(() => {
    data.forEach((e, i) => {
      setLayerVisibility((prev) => ({
        ...prev,
        [i]: true,
      }));
    });
  }, [data]);

  return (
    <div className="relative h-screen w-full ">
      {/* Top Bar */}
      <div className="absolute  z-[999999] top-0 left-0 right-0 flex items-center p-2 bg-white">
        <div className="flex-1 mx-4">
          <SearchAutocomplete
            onSelect={(item) => setSelectedLocation(item)}
            data={data.map((item) => item.markers).flat()}
          />
        </div>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setShowFilterLayerCard(!showFilterLayerCard)}
        >
          <LucideIcons.Menu className="w-6 h-6 pointer-events-none" />
        </button>
      </div>

      {/* Left Bar with Layer Toggles */}
      <div
        className={`fixed z-[99998] top-[3.6rem] h-[calc(100vh-58px)] min-w-[300px] bg-white rounded-lg shadow-xl border border-gray-300 transition-transform duration-300 ${
          showFilterLayerCard ? "translate-x-[150vw]" : "translate-x-[calc(100vw_-100%)]"
        }`}
        dir="rtl"
      >
        <h3 className="p-3 font-semibold text-lg text-gray-800">
          {showAdminLayerCard ? "ניהול וסינון" : "סינון"} שכבות המפה
        </h3>
        <div className="p-4 h-[calc(100vh-110px)] overflow-auto">
          {showAdminLayerCard ? (
            <div className="border-b ">
              <h3
                className="font-medium mb-2 cursor-pointer hover:text-blue-600"
                onClick={() => setIsModalOpen(true)}
              >
                {mapName}
              </h3>

              <div className="space-y-3">
                {data.map((layer, index) => {
                  const IconComponent =
                    layer.icon && LucideIcons[layer.icon]
                      ? LucideIcons[layer.icon]
                      : LucideIcons.MapPin;

                  return (
                    <div key={index} className="flex items-center justify-between">
                      {layer.icon && layer.color && (
                        <div className="flex  items-center justify-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: layer.background, color: layer.color }}
                          >
                            <IconComponent className="w-4 h-4 " style={{ color: layer.color }} />
                          </div>
                          <span className="text-sm mr-3">{layer.category}</span>
                        </div>
                      )}
                      <button
                        className="text-sm text-gray-600 hover:text-gray-800 float-left"
                        onClick={() => setIsLayerCustomizationOpen(index + "")}
                      >
                        <LucideIcons.Settings className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between border-t pt-3">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setIsUploadFileOpen(true)}
                  >
                    הוספת שכבה
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 ">הערכה האחרונה בוצעה לפני כמה שניות</p>
            </div>
          ) : (
            ""
          )}
          {data.length === 0 ? (
            <h2 className="pt-4">אין שכבות זמינות</h2>
          ) : (
            <>
              {/* כפתור בחר הכל / הסר הכל */}
              <button
                className="w-full mb-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  const allSelected = Object.values(layerVisibility).every((visible) => visible);
                  toggleAllLayers(!allSelected);
                }}
              >
                {Object.values(layerVisibility).every((visible) => visible) ? "הסר הכל" : "בחר הכל"}
              </button>
              {data.map((layer, index) => {
                const IconComponent =
                  layer.icon && LucideIcons[layer.icon]
                    ? LucideIcons[layer.icon]
                    : LucideIcons.MapPin;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                    onClick={() =>
                      setLayerVisibility((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                  >
                    {/* אייקון שכבה */}
                    <div className="flex items-center gap-2">
                      {layer.icon && layer.color && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: layer.background,
                            color: layer.color,
                            opacity: layerVisibility[index] ? 1 : 0.4,
                          }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: layer.color }} />
                        </div>
                      )}
                      <span
                        className={`text-sm mr-2 ${
                          !layerVisibility[index]
                            ? "text-[gray] font-medium"
                            : " text-[black] font-bold"
                        }`}
                      >
                        {layer.category}
                      </span>
                    </div>

                    {/* כפתור טוגל */}
                    <button
                      className={`w-10 h-5 flex items-center rounded-full transition delay-0 shadow-custom ${
                        layerVisibility[index] ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transform transition shadow-custom ${
                          layerVisibility[index] ? "translate-x-[-20px]" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Help Button */}
      <button className="absolute z-[999] bottom-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
        <LucideIcons.HelpCircle className="w-5 h-5" />
      </button>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">עריכת השם והתיאור של המפה</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">כותרת מפה</label>
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="מפה ללא שם"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">תיאור</label>
              <textarea
                value={mapDescription}
                onChange={(e) => setMapDescription(e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                placeholder="תיאור המפה"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                שמירה
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add File */}
      <FileUploadDialog
        isOpen={isUploadFileOpen}
        setIsOpen={setIsUploadFileOpen}
        {...{ data, setData }}
      />
      {typeof isLayerCustomizationOpen == "string" && (
        <LayerCustomization
          isOpen={isLayerCustomizationOpen}
          setIsOpen={setIsLayerCustomizationOpen}
          isLayerCustomizationOpen={isLayerCustomizationOpen}
          data={data[isLayerCustomizationOpen]}
          setData={setData}
        />
      )}
      {/* Map Component - Pass layer visibility */}
      <div className="h-full w-[calc(100%_-_0px)] relative">
        <Map
          data={data.filter((_, index) => layerVisibility[index])}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
};

export default MapInterface;
