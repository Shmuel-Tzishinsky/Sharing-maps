import { useEffect, useState } from "react";

const { Dialog, DialogContent, DialogTitle } = require("#components/ui/dialog");
const { DialogHeader } = require("./dialog");

const EditMarkerDialog = ({
  isOpen,
  setIsOpen,
  markerData,
  handleTheChanges,
  categories,
  deleteMarker,
}) => {
  const [marker, setMarker] = useState(markerData);
  const [isCustom, setIsCustom] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (markerData) {
      setMarker(markerData);
    }
  }, [markerData]);

  const handleChange = (key, value) => {
    setMarker((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
    } else {
      handleChange("category", value);
      setIsCustom(false);
    }
  };

  const handleCustomCategorySubmit = () => {
    if (newCategory.trim()) {
      handleChange("category", newCategory.trim());
      categories.push(newCategory.trim());
      setIsCustom(false);
      setNewCategory("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">עריכת נתוני המיקום</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-4 max-h-[65vh] max-w-[95vw] sm:max-w-[400px] overflow-auto mt-4">
            {/* שם המיקום */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              שם המיקום
            </label>
            <input
              id="title"
              type="text"
              value={marker.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="שם המיקום"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            {/* תיאור */}
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              תיאור
            </label>
            <textarea
              id="description"
              value={marker.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="תיאור"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            {/* כתובת */}
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              כתובת המיקום
            </label>
            <input
              id="address"
              type="text"
              value={marker.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="כתובת"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            {/* קטגוריה */}
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              קטגוריה
            </label>
            <div className="w-full">
              {isCustom ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border rounded border-[#a3a1a1]"
                    placeholder="הקלד קטגוריה חדשה"
                  />
                  <button
                    onClick={handleCustomCategorySubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    הוסף
                  </button>
                </div>
              ) : (
                <select
                  id="category"
                  value={marker.category}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border rounded border-[#a3a1a1]"
                >
                  <option value="custom">הוסף קטגוריה חדשה</option>
                  {categories.map((cat, i) => (
                    <option value={cat} key={i}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* מזהה */}
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              מזהה
            </label>
            <input
              id="id"
              type="text"
              value={marker.id}
              readOnly
              className="w-full p-2 border rounded border-[#a3a1a1] bg-gray-100"
            />

            {/* תמונה */}
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              קישור לתמונה
            </label>
            <input
              id="image"
              type="text"
              value={marker.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="קישור לתמונה"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            {/* תצוגה מקדימה של תמונה */}
            {marker.image && marker.image.length && (
              <img
                src={marker.image}
                alt="תצוגה מקדימה"
                className="w-[50%] h-32 object-cover rounded m-auto"
              />
            )}

            {/* מיקום (קו רוחב, קו אורך) */}
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              קו רוחב
            </label>
            <input
              id="latitude"
              type="text"
              value={marker.position[0]}
              onChange={(e) =>
                handleChange("position", [parseFloat(e.target.value), marker.position[1]])
              }
              placeholder="קו רוחב"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              קו אורך
            </label>
            <input
              id="longitude"
              type="text"
              value={marker.position[1]}
              onChange={(e) =>
                handleChange("position", [marker.position[0], parseFloat(e.target.value)])
              }
              placeholder="קו אורך"
              className="w-full p-2 border rounded border-[#a3a1a1]"
            />

            <button
              id="deleteLocation"
              className="bg-error text-sm font-medium mr-4 ml-4 text-white w-[90%] p-2 border rounded-xl hover:bg-[#b91c1cd8]"
              onClick={() => {
                deleteMarker(marker.id);
                setIsOpen(false);
              }}
            >
              מחק את המיקום
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              ביטול
            </button>
            <button
              onClick={() => {
                handleTheChanges(marker);
                setIsOpen(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              שמירה
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMarkerDialog;
