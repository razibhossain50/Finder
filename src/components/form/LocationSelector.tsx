import { useState, useRef, useEffect } from "react";
import { ChevronLeft, X, ChevronRight, ChevronDown } from "lucide-react";
import { geoLocation } from "../../api/geo-location";

type SelectionPath = {
  country?: string;
  division?: string;
  district?: string;
  upazila?: string;
};

type Level = "country" | "division" | "district" | "upazila";

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
  value?: string;
}

export function LocationSelector({ onLocationSelect, value }: LocationSelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<Level>("country");
  const [selectionPath, setSelectionPath] = useState<SelectionPath>({});
  const [locationSelection, setLocationSelection] = useState<string>("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const locationContainerRef = useRef<HTMLDivElement>(null);
  const data = geoLocation[0];

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setLocationSelection(value);
    }
  }, [value]);

  // Check if an option has children (should show arrow)
  const hasChildren = (value: string, level: Level) => {
    switch (level) {
      case "country":
        return true; // Country always has divisions
      case "division":
        if (value === "All Divisions") return false; // "All Divisions" doesn't have children
        const division = data.divisions.find((div) => div.name === value);
        return division && division.districts && division.districts.length > 0;
      case "district":
        if (value === "All Districts") return false; // "All Districts" doesn't have children
        const selectedDivision = data.divisions.find((div) => div.name === selectionPath.division);
        const district = selectedDivision?.districts?.find((dist) => dist.name === value);
        return district && district.upazilas && district.upazilas.length > 0;
      case "upazila":
        if (value === "All Upazilas") return false;
        return false; // Upazilas are the final level, no children
      default:
        return false;
    }
  };

  // Get current location options based on level and selection path
  const getCurrentLocationOptions = () => {
    switch (currentLevel) {
      case "country":
        return [{ name: data.country, value: data.country, hasChildren: hasChildren(data.country, "country") }];
      case "division":
        return data.divisions.map((div) => ({
          name: div.name,
          value: div.name,
          hasChildren: hasChildren(div.name, "division")
        }));
      case "district":
        const selectedDivision = data.divisions.find((div) => div.name === selectionPath.division);
        if (!selectedDivision || !selectedDivision.districts) return [];

        return selectedDivision.districts.map((dist) => ({
          name: dist.name,
          value: dist.name,
          hasChildren: hasChildren(dist.name, "district")
        }));
      case "upazila":
        const division = data.divisions.find((div) => div.name === selectionPath.division);
        const selectedDistrict = division?.districts?.find((dist) => dist.name === selectionPath.district);
        return selectedDistrict?.upazilas.map((upazila) => ({
          name: upazila,
          value: upazila,
          hasChildren: false
        })) || [];
      default:
        return [];
    }
  };

  // Handle location selection
  const handleLocationSelection = (value: string) => {
    const newPath = { ...selectionPath };

    switch (currentLevel) {
      case "country":
        newPath.country = value;
        setSelectionPath(newPath);
        setCurrentLevel("division");
        break;
      case "division":
        if (value === "All Divisions") {
          // Close dropdown and set selection
          setLocationSelection("All Divisions");
          onLocationSelect("All Divisions");
          setIsLocationDropdownOpen(false);
          return;
        }
        newPath.division = value;
        setSelectionPath(newPath);
        setCurrentLevel("district");
        break;
      case "district":
        if (value === "All Districts") {
          // Close dropdown and set selection
          const fullPath = `${newPath.country} > ${newPath.division} > All Districts`;
          setLocationSelection(fullPath);
          onLocationSelect("All Districts");
          setIsLocationDropdownOpen(false);
          return;
        }
        newPath.district = value;
        setSelectionPath(newPath);
        setCurrentLevel("upazila");
        break;
      case "upazila":
        if (value === "All Upazilas") {
          // Close dropdown and set selection
          const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > All Upazilas`;
          setLocationSelection(fullPath);
          onLocationSelect("All Upazilas");
          setIsLocationDropdownOpen(false);
          return;
        }
        newPath.upazila = value;
        setSelectionPath(newPath);
        const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > ${value}`;
        setLocationSelection(fullPath);
        onLocationSelect(value);
        setIsLocationDropdownOpen(false);
        break;
    }
  };

  // Reset location selection
  const resetLocation = () => {
    setSelectionPath({});
    setLocationSelection("");
    onLocationSelect("");
    setCurrentLevel("country");
    setIsLocationDropdownOpen(true);
  };

  const handleToggleDropdown = () => {
    if (!locationSelection) {
      setIsLocationDropdownOpen(!isLocationDropdownOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const levelTitles = {
    country: "Select Country",
    division: "Select Division",
    district: "Select District",
    upazila: "Select Upazila",
  };

  return (
    <div className="relative">
      {locationSelection ? (
        <div
          className="w-full px-3 py-2 rounded-[14px] h-12 bg-[#f4f4f5] flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleToggleDropdown}
        >
          <span className="text-sm truncate">{locationSelection}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetLocation();
            }}
            className="ml-2 p-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          ref={locationContainerRef}
          className="relative"
          onClick={handleToggleDropdown}
        >
          <div
            className="w-full px-3 py-2 rounded-[14px] h-12 bg-[#f4f4f5] flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-muted-foreground">Select location</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          {isLocationDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {currentLevel !== "country" && (
                <div className="flex items-center justify-between p-2 border-b border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const levels: Level[] = ["country", "division", "district", "upazila"];
                      const currentIndex = levels.indexOf(currentLevel);
                      if (currentIndex > 0) {
                        setCurrentLevel(levels[currentIndex - 1]);
                      }
                    }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <span className="text-sm font-medium">{levelTitles[currentLevel]}</span>
                </div>
              )}
              <div className="p-2 max-h-48 overflow-y-auto">
                {getCurrentLocationOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationSelection(option.value);
                    }}
                    className="w-full p-2 text-left rounded-md hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm">{option.name}</span>
                    {option.hasChildren && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}