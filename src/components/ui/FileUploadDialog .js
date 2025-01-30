import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";
import { Upload, X } from "lucide-react";

const FileUploadDialog = ({ isOpen, setIsOpen, mapData, setMapData }) => {
  const fileInputRef = useRef(null);

  const UpdateTheState = async (selectedFiles) => {
    for (const file of selectedFiles) {
      const fileContent = await file.text();
      const content = JSON.parse(fileContent);

      setMapData((prev) => {
        if (prev.data.some((item) => item.category === content.name)) {
          return prev; // למנוע כפילויות
        }

        return {
          ...prev,
          data: [
            ...prev.data,
            {
              markers: content.features.map((mark) => ({
                id: mark.geometry.coordinates[1] + mark.geometry.coordinates[0],
                position: [mark.geometry.coordinates[1], mark.geometry.coordinates[0]],
                category: content.name,
                title: mark.properties["שם"] || null,
                description: mark.properties["תיאור"] || null,
                image: mark.properties["תמונה"] || null,
                address: mark.properties["כתובת"] || null,
                showLabel: false,
              })),
              showLabelInAll: false,
              category: content.name,
              color: "#ffffff",
              background: "#333333",
              icon: "MapPin",
            },
          ],
        };
      });
    }
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    UpdateTheState(selectedFiles);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);

    UpdateTheState(droppedFiles);
  };

  const removeFile = (index) => {
    setMapData((prev) => {
      return { ...prev, data: prev.data.filter((_, i) => i !== index) };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right text-lg font-semibold">העלאת קובץ</DialogTitle>
        </DialogHeader>

        {/* אזור גרירה ולחיצה להעלאה */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()} // קליק יפתח את בוחר הקבצים
        >
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">גרור ושחרר כאן קבצים</p>
          <p className="text-gray-400 text-xs">או לחץ כדי לבחור קבצים מהמכשיר</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple // ✅ מאפשר בחירת מספר קבצים
            onChange={handleFileChange}
            accept=".geojson, .xlsx"
          />
        </div>

        {/* הצגת הקבצים שנבחרו */}
        {mapData.data.length > 0 && (
          <div className="mt-4 space-y-2">
            {mapData.data.map((file, index) => (
              <div
                key={index}
                className="p-2 bg-gray-100 rounded-lg flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{file.category}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* כפתורים */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-1 border rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            ביטול
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={mapData.data.length === 0}
            onClick={() => setIsOpen(false)}
          >
            העלאה
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
