import React, { useState, useMemo } from "react";
import { FixedSizeGrid } from "react-window"; // טעינה עצלה
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";
import * as LucideIcons from "lucide-react";
import { Search } from "lucide-react";

const ICONS_PER_ROW = 8; // מספר האייקונים בכל שורה
const ICON_SIZE = 40; // גודל כל אייקון בתצוגה

const LayerCustomization = ({ isOpen, setIsOpen, isLayerCustomizationOpen, data, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // חישוב ממוּזן (useMemo) למניעת חישוב נוסף בכל רינדור
  const filteredIcons = useMemo(() => {
    return Object.entries(LucideIcons)
      .filter(([name, Icon]) => typeof Icon === "object" && typeof Icon.render === "function")
      .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleIconChange = (index, iconName) => {
    setData((items) => {
      return items.map((item, i) => (i === parseFloat(index) ? { ...item, icon: iconName } : item));
    });
  };

  const handleNameChange = (eve, index) => {
    setData((items) => {
      return items.map((item, i) =>
        i === parseFloat(index) ? { ...item, name: eve.target.value } : item
      );
    });
  };
  const handleColorChange = (eve, index) => {
    setData((items) => {
      return items.map((item, i) =>
        i === parseFloat(index) ? { ...item, color: eve.target.value } : item
      );
    });
  };
  const handleBackgroundColorChange = (eve, index) => {
    setData((items) => {
      return items.map((item, i) =>
        i === parseFloat(index) ? { ...item, background: eve.target.value } : item
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md " dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">הגדרת שכבות</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4 max-h-[70vh] overflow-auto">
          <div className="p-4 bg-gray-50 rounded-lg space-y-4 w-full">
            <input
              type="text"
              defaultValue={data.name}
              onChange={(eve) => handleNameChange(eve, isLayerCustomizationOpen)}
              className="w-full font-medium text-gray-900"
            />

            <div className="gap-2  flex items-center justify-between ">
              <div className="gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2  font-[ProximaNova]">
                  בחר צבע אייקון
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="color"
                    className="w-full rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    value={data.color}
                    onChange={(eve) => handleColorChange(eve, isLayerCustomizationOpen)}
                  />
                </div>
              </div>
              <div className="gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  בחר את רקע האייקון
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="color"
                    value={data.background}
                    className="w-full rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    onChange={(eve) => handleBackgroundColorChange(eve, isLayerCustomizationOpen)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">בחר אייקון</label>

              {/* תיבת חיפוש */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="חפש אייקון..."
                  className="w-full p-2 pr-10 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Grid עם טעינה עצלה */}
              <FixedSizeGrid
                columnCount={ICONS_PER_ROW}
                columnWidth={ICON_SIZE}
                height={200} // גובה הקופסה של האייקונים
                rowCount={Math.ceil(filteredIcons.length / ICONS_PER_ROW)}
                rowHeight={ICON_SIZE}
                width={ICONS_PER_ROW * ICON_SIZE}
                style={{ margin: "0 auto" }}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const iconIndex = rowIndex * ICONS_PER_ROW + columnIndex;
                  if (iconIndex >= filteredIcons.length) return null;
                  const [name, Icon] = filteredIcons[iconIndex];

                  return (
                    <button
                      key={name}
                      onClick={() => handleIconChange(isLayerCustomizationOpen, name)}
                      className={`p-2 rounded-lg hover:bg-gray-100 w-10 h-10 flex items-center justify-center ${
                        data.icon === name ? "bg-blue-100 ring-2 ring-blue-500" : ""
                      }`}
                      title={name}
                      style={style} // משמר את הגודל של האלמנט
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                    </button>
                  );
                }}
              </FixedSizeGrid>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            סגור
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LayerCustomization;
