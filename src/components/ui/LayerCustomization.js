import React, { useState, useMemo } from "react";
import { FixedSizeGrid } from "react-window"; // טעינה עצלה
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog";
import * as LucideIcons from "lucide-react";
import { Search } from "lucide-react";

const ICONS_PER_ROW = 8; // מספר האייקונים בכל שורה
const ICON_SIZE = 40; // גודל כל אייקון בתצוגה

const LayerCustomization = ({ isOpen, setIsOpen, isLayerCustomizationOpen, data, setMapData }) => {
  if (!data) return;
  const [searchTerm, setSearchTerm] = useState("");

  // חישוב ממוּזן (useMemo) למניעת חישוב נוסף בכל רינדור
  const filteredIcons = useMemo(() => {
    return Object.entries(LucideIcons)
      .filter(([name, Icon]) => typeof Icon === "object" && typeof Icon.render === "function")
      .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleChange = (index, key, value) => {
    setMapData((prev) => ({
      ...prev,
      data: prev.data.map((item, i) =>
        i === parseFloat(index) ? { ...item, [key]: value } : item
      ),
    }));
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
              defaultValue={data.category}
              onChange={(eve) => handleChange(isLayerCustomizationOpen, "name", eve.target.value)}
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
                    onChange={(eve) =>
                      handleChange(isLayerCustomizationOpen, "color", eve.target.value)
                    }
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
                    onChange={(eve) =>
                      handleChange(isLayerCustomizationOpen, "background", eve.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">הצג תווית</label>
              <div className="flex flex-row">
                <button
                  onClick={() => handleChange(isLayerCustomizationOpen, "showLabelInAll", true)}
                  className="p-2 w-1/3 text-center bg-white border rounded-sm hover:bg-[#dbdada]"
                  style={{ background: data.showLabelInAll === true && "#3b82f6" }}
                >
                  תמיד
                </button>
                <button
                  onClick={() => handleChange(isLayerCustomizationOpen, "showLabelInAll", false)}
                  className="p-2 w-1/3 text-center bg-white border rounded-sm hover:bg-[#dbdada]"
                  style={{ background: data.showLabelInAll === false && "#3b82f6" }}
                >
                  מוסתר
                </button>
                <button
                  onClick={() => handleChange(isLayerCustomizationOpen, "showLabelInAll", null)}
                  className="p-2 w-1/3 text-center bg-white border rounded-sm hover:bg-[#dbdada]"
                  style={{ background: data.showLabelInAll === null && "#3b82f6" }}
                >
                  לעולם לא
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">כיוון התווית</label>
              <div className="flex flex-row flex-wrap">
                {[
                  ["auto", "אוטומטי"],
                  ["top", "למעלה"],
                  ["center", "אמצע"],
                  ["left", "שמאל"],
                  ["right", "ימין"],
                  ["bottom", "למטה"],
                ].map((ite, ind) => (
                  <button
                    key={ind}
                    onClick={() => handleChange(isLayerCustomizationOpen, "dirLabel", ite[0])}
                    className="p-2 w-1/3 text-center bg-white border rounded-sm hover:bg-[#dbdada]"
                    style={{
                      background:
                        (data.dirLabel === ite[0] ||
                          (!data?.dirLabel?.length && ite[0] == "auto")) &&
                        "#3b82f6",
                    }}
                  >
                    {ite[1]}
                  </button>
                ))}
                {/* <button
                  onClick={() => handleChange(isLayerCustomizationOpen, "dirLabel", "top")}
                  className="p-2 w-1/3 text-center bg-white border rounded-sm hover:bg-[#dbdada]"
                  style={{
                    background:
                      (data.dirLabel === "top" && "#3b82f6") ||
                      (!data.dirLabel?.includes("top") &&
                        !data.dirLabel?.includes("right") &&
                        !data.dirLabel?.includes("l") &&
                        !data.dirLabel?.includes("b") &&
                        "#3b82f6"),
                  }}
                >
                  למעלה
                </button> */}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">בחר אייקון</label>

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
                      onClick={() => handleChange(isLayerCustomizationOpen, "icon", name)}
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
