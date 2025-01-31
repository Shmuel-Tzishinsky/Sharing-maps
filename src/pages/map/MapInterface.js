import React, { useCallback, useEffect, useRef, useState } from "react";

import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";
import FileUploadDialog from "#components/ui/FileUploadDialog ";
import Map from "#components/MapUpload";
import LayerCustomization from "#components/ui/LayerCustomization";
import SearchAutocomplete from "#components/ui/SearchAutocomplete";
import EditMarkerDialog from "#components/ui/EditMarkerDialog";
import LayerManagement from "#components/Map/ui/LayerManagement";

const MapInterface = ({ mapData, setMapData, showAdminLayerCard = true }) => {
  console.log("🚀 ~ MapInterface ~ mapData:", mapData);
  const [showFilterLayerCard, setShowFilterLayerCard] = useState(false);
  // Cards toggle (open / false)
  const [openModals, setOpenModals] = useState({
    modal: false,
    uploadFile: false,
    layerCustomization: null,
    editMarker: null,
  });

  // select data location from search
  const [pickedLocation, setPickedLocation] = useState(null);

  const handleSave = useCallback(
    () => () => {
      setIsModalOpen(false);
    },
    []
  );

  // New state to track layer visibility
  const [layerVisibility, setLayerVisibility] = useState(
    mapData.data.reduce((acc, layer, index) => {
      acc[index] = true; // Default all layers to visible
      return acc;
    }, {})
  );

  const SaveInDB = async () => {
    try {
      const response = await fetch("/api/maps/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mapData),
      });
      console.log("🚀 ~ SaveInDB ~ response:", response);

      if (!response.ok) {
        throw new Error("Failed to save map data");
      }

      const result = await response.json();
      console.log("Map data saved successfully:", result);
    } catch (error) {
      console.error("Error saving map data:", error);
    }
  };

  return (
    <div className="relative h-screen w-full ">
      {/* Top Bar */}
      <div className="absolute  z-[999999] top-0 left-0 right-0 flex items-center p-2 bg-white">
        <button className="px-4 py-2 bg-blue-500 text-white font-medium" onClick={SaveInDB}>
          שמור
        </button>
        <div className="flex-1 mx-4">
          <SearchAutocomplete
            onSelect={(item) => setPickedLocation(item)}
            data={mapData.data.map((item) => item.markers).flat()}
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
                className="font-medium mb-4 pb-2 text-center border-b-2 cursor-pointer hover:text-blue-600"
                onClick={() => setOpenModals((prev) => ({ ...prev, modal: true }))}
              >
                {mapData.name}
              </h3>

              <div className="space-y-3">
                {mapData.data.map((layer, index) => {
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
                          <span className="text-sm mr-3">
                            {layer.category} ({layer.markers.length})
                          </span>
                        </div>
                      )}
                      <button
                        className="text-sm text-gray-600 hover:text-gray-800 float-left"
                        onClick={() =>
                          setOpenModals((prev) => ({ ...prev, layerCustomization: index + "" }))
                        }
                      >
                        <LucideIcons.Settings className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-3">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setOpenModals((prev) => ({ ...prev, uploadFile: true }))}
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
        </div>
      </div>

      {/* Help Button */}
      <button className="absolute z-[999] bottom-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
        <LucideIcons.HelpCircle className="w-5 h-5" />
      </button>

      {/* Edit Modal */}
      <Dialog
        open={openModals.modal}
        onOpenChange={() => setOpenModals((prev) => ({ ...prev, modal: false }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">עריכת השם והתיאור של המפה</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">כותרת מפה</label>
              <input
                type="text"
                value={mapData.name}
                onChange={(e) => setMapData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="מפה ללא שם"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">תיאור</label>
              <textarea
                value={mapData.description}
                onChange={(e) => setMapData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-md h-24"
                placeholder="תיאור המפה"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenModals((prev) => ({ ...prev, modal: false }))}
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
        isOpen={openModals.uploadFile}
        setIsOpen={() => setOpenModals((prev) => ({ ...prev, uploadFile: false }))}
        {...{ mapData, setMapData }}
      />
      <LayerCustomization
        isOpen={openModals.layerCustomization}
        setIsOpen={() => setOpenModals((prev) => ({ ...prev, layerCustomization: null }))}
        isLayerCustomizationOpen={openModals.layerCustomization}
        data={mapData.data[openModals.layerCustomization] || false}
        setMapData={setMapData}
      />
      {/* edit marker */}
      {openModals.editMarker && (
        <EditMarkerDialog
          isOpen={openModals.editMarker !== null}
          setIsOpen={() => setOpenModals((prev) => ({ ...prev, editMarker: null }))}
          markerData={openModals.editMarker}
          categories={mapData.data.map((item) => item.category)}
          deleteMarker={(id) => {
            setMapData((prev) => {
              const updatedData = prev.data.map((category) => ({
                ...category,
                markers: category.markers.filter((marker) => marker.id !== id),
              }));

              return {
                ...prev,
                data: updatedData,
              };
            });
          }}
          handleTheChanges={(updatedMarker) =>
            setMapData((prev) => {
              const oldCategoryIndex = prev.data.findIndex((cat) =>
                cat.markers.some((marker) => marker.id === updatedMarker.id)
              );

              let newCategoryIndex = prev.data.findIndex(
                (cat) => cat.category === updatedMarker.category
              );

              // אם הקטגוריה חדשה לגמרי
              if (newCategoryIndex === -1) {
                // יצירת קטגוריה חדשה
                const newCategory = {
                  category: updatedMarker.category,
                  background: "#333333",
                  color: "#ffffff",
                  icon: "MapPin",
                  markers: [],
                };

                // הוספת הקטגוריה החדשה למערך
                prev.data.push(newCategory);
                newCategoryIndex = prev.data.length - 1;
              }

              const updatedData = [...prev.data];

              // מסירים את המארקר מהקטגוריה הישנה אם קיימת
              if (oldCategoryIndex !== -1) {
                updatedData[oldCategoryIndex] = {
                  ...updatedData[oldCategoryIndex],
                  markers: updatedData[oldCategoryIndex].markers.filter(
                    (marker) => marker.id !== updatedMarker.id
                  ),
                };
              }

              // מוסיפים את המארקר לקטגוריה החדשה
              updatedData[newCategoryIndex] = {
                ...updatedData[newCategoryIndex],
                markers: [...updatedData[newCategoryIndex].markers, updatedMarker],
              };

              return { ...prev, data: updatedData };
            })
          }
        />
      )}

      <LayerManagement {...{ mapData, setPickedLocation, layerVisibility, setLayerVisibility }} />

      {/* Map Component - Pass layer visibility */}
      <div className="h-full w-[calc(100%_-_0px)] relative">
        <Map
          data={mapData.data.filter((_, index) => layerVisibility[index])}
          pickedLocation={pickedLocation}
          editMarkerFunc={setOpenModals}
        />
      </div>
    </div>
  );
};

export default MapInterface;
