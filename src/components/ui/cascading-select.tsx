import { Label } from "@/components/ui/label";
import { addressData } from "../../lib/address-data";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";

interface CascadingSelectProps {
  type: "permanent" | "present";
  data: any;
  errors: any;
  updateData: (data: Partial<any>) => void;
}

interface AddressLevel {
  type: 'country' | 'division' | 'zilla' | 'upazilla';
  title: string;
  items: Array<{ value: string; label: string; }>;
}

export function CascadingSelect({ type, data, errors, updateData }: CascadingSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'country' | 'division' | 'zilla' | 'upazilla'>('country');
  const [breadcrumb, setBreadcrumb] = useState<Array<{level: string, value: string, label: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countryKey = `${type}Country`;
  const divisionKey = `${type}Division`;
  const zillaKey = `${type}Zilla`;
  const upazillaKey = `${type}Upazilla`;

  const selectedCountry = data[countryKey];
  const selectedDivision = data[divisionKey];
  const selectedZilla = data[zillaKey];
  const selectedUpazilla = data[upazillaKey];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current level data
  const getCurrentLevelData = (): AddressLevel => {
    switch (currentLevel) {
      case 'country':
        return {
          type: 'country',
          title: 'Select Country',
          items: Object.keys(addressData).map(code => ({
            value: code,
            label: addressData[code].name
          }))
        };
      
      case 'division':
        if (!selectedCountry) return { type: 'division', title: 'Select Division', items: [] };
        return {
          type: 'division',
          title: 'Select Division',
          items: Object.keys(addressData[selectedCountry].divisions).map(code => ({
            value: code,
            label: addressData[selectedCountry].divisions[code].name
          }))
        };
      
      case 'zilla':
        if (!selectedCountry || !selectedDivision) return { type: 'zilla', title: 'Select Zilla', items: [] };
        return {
          type: 'zilla',
          title: 'Select Zilla',
          items: Object.keys(addressData[selectedCountry].divisions[selectedDivision].districts).map(code => ({
            value: code,
            label: addressData[selectedCountry].divisions[selectedDivision].districts[code].name
          }))
        };
      
      case 'upazilla':
        if (!selectedCountry || !selectedDivision || !selectedZilla) return { type: 'upazilla', title: 'Select Upazilla', items: [] };
        return {
          type: 'upazilla',
          title: 'Select Upazilla',
          items: addressData[selectedCountry].divisions[selectedDivision].districts[selectedZilla].upazilas.map((name: string) => ({
            value: name,
            label: name
          }))
        };
      
      default:
        return { type: 'country', title: 'Select Country', items: [] };
    }
  };

  const handleSelect = (value: string, label: string) => {
    const updates: any = {};
    
    switch (currentLevel) {
      case 'country':
        updates[countryKey] = value;
        updates[divisionKey] = "";
        updates[zillaKey] = "";
        updates[upazillaKey] = "";
        setBreadcrumb([{ level: 'country', value, label }]);
        setCurrentLevel('division');
        break;
      
      case 'division':
        updates[divisionKey] = value;
        updates[zillaKey] = "";
        updates[upazillaKey] = "";
        setBreadcrumb(prev => [...prev.slice(0, 1), { level: 'division', value, label }]);
        setCurrentLevel('zilla');
        break;
      
      case 'zilla':
        updates[zillaKey] = value;
        updates[upazillaKey] = "";
        setBreadcrumb(prev => [...prev.slice(0, 2), { level: 'zilla', value, label }]);
        setCurrentLevel('upazilla');
        break;
      
      case 'upazilla':
        updates[upazillaKey] = value;
        setBreadcrumb(prev => [...prev.slice(0, 3), { level: 'upazilla', value, label }]);
        setIsOpen(false);
        setCurrentLevel('country');
        break;
    }
    
    updateData(updates);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    
    const levels = ['country', 'division', 'zilla', 'upazilla'];
    const nextLevel = levels[index + 1] as 'country' | 'division' | 'zilla' | 'upazilla';
    setCurrentLevel(nextLevel || 'country');
  };

  const resetSelection = () => {
    setBreadcrumb([]);
    setCurrentLevel('country');
    updateData({
      [countryKey]: "",
      [divisionKey]: "",
      [zillaKey]: "",
      [upazillaKey]: "",
    });
  };

  const getDisplayValue = () => {
    const parts = [];
    if (selectedCountry) parts.push(addressData[selectedCountry]?.name);
    if (selectedDivision) parts.push(addressData[selectedCountry]?.divisions[selectedDivision]?.name);
    if (selectedZilla) parts.push(addressData[selectedCountry]?.divisions[selectedDivision]?.districts[selectedZilla]?.name);
    if (selectedUpazilla) parts.push(selectedUpazilla);
    
    return parts.length > 0 ? parts.join(' → ') : '';
  };

  const currentData = getCurrentLevelData();

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label>
        {type === "permanent" ? "Permanent" : "Present"} Address 
        <span className="text-red-500">*</span>
      </Label>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[40px]"
        >
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className={`${getDisplayValue() ? 'text-gray-900' : 'text-gray-500'}`}>
              {getDisplayValue() || `Select ${type} address...`}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Header with breadcrumb */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm">
                  {breadcrumb.map((item, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />}
                      <button
                        type="button"
                        onClick={() => handleBreadcrumbClick(index)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.label}
                      </button>
                    </div>
                  ))}
                  {breadcrumb.length > 0 && <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />}
                  <span className="text-gray-700 font-medium">{currentData.title}</span>
                </div>
                {breadcrumb.length > 0 && (
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="max-h-60 overflow-y-auto">
              {currentData.items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSelect(item.value, item.label)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:bg-blue-50 focus:text-blue-900 border-b border-gray-100 last:border-b-0"
                >
                  {item.label}
                </button>
              ))}
              {currentData.items.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No options available
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(errors[countryKey] || errors[divisionKey] || errors[zillaKey] || errors[upazillaKey]) && (
        <p className="text-sm text-red-500">
          {errors[countryKey] || errors[divisionKey] || errors[zillaKey] || errors[upazillaKey]}
        </p>
      )}
    </div>
  );
}
