import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
}

export function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<Level>("country");
  const [selectionPath, setSelectionPath] = useState<SelectionPath>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [locationSelection, setLocationSelection] = useState<string>("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const data = geoLocation[0];

  // Get current location options based on level and selection path
  const getCurrentLocationOptions = () => {
    switch (currentLevel) {
      case "country":
        return [{ name: data.country, value: data.country }];
      case "division":
        return data.divisions.map((div) => ({ name: div.name, value: div.name }));
      case "district":
        const selectedDivision = data.divisions.find((div) => div.name === selectionPath.division);
        return selectedDivision?.districts.map((dist) => ({ name: dist.name, value: dist.name })) || [];
      case "upazila":
        const division = data.divisions.find((div) => div.name === selectionPath.division);
        const selectedDistrict = division?.districts.find((dist) => dist.name === selectionPath.district);
        return selectedDistrict?.upazilas.map((upazila) => ({ name: upazila, value: upazila })) || [];
      default:
        return [];
    }
  };

  // Handle location selection
  const handleLocationSelection = async (value: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newPath = { ...selectionPath };

    switch (currentLevel) {
      case "country":
        newPath.country = value;
        setSelectionPath(newPath);
        await animateToLevel("division");
        break;
      case "division":
        newPath.division = value;
        setSelectionPath(newPath);
        await animateToLevel("district");
        break;
      case "district":
        newPath.district = value;
        setSelectionPath(newPath);
        await animateToLevel("upazila");
        break;
      case "upazila":
        newPath.upazila = value;
        setSelectionPath(newPath);
        const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > ${value}`;
        setLocationSelection(fullPath);
        onLocationSelect(value);
        setIsLocationDropdownOpen(false);
        break;
    }

    setIsAnimating(false);
  };

  // Animate to a specific level
  const animateToLevel = async (level: Level) => {
    setCurrentLevel(level);
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  // Reset location selection
  const resetLocation = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectionPath({});
    setLocationSelection("");
    onLocationSelect("");
    setIsLocationDropdownOpen(true);
    await animateToLevel("country");
    setIsAnimating(false);
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
          className="w-full p-3 border rounded-md bg-background flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
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
            className="w-full p-3 border rounded-md bg-background flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-muted-foreground">Select location</span>
          </div>

          {isLocationDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg">
              {currentLevel !== "country" && (
                <div className="flex items-center justify-between p-2 border-b">
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
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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