import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/form/LocationSelector";

interface SearchFiltersProps {
  onSearch: (filters: {
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [gender, setGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [locationSelection, setLocationSelection] = useState<string>("");
  const [biodataNumber, setBiodataNumber] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      gender,
      maritalStatus,
      location: locationSelection,
      biodataNumber,
    });
  };

  return (
    <Card className="w-full shadow-md border-neutral-200">
      <CardHeader className="bg-neutral-50 rounded-t-lg space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Find Your Perfect Match
        </CardTitle>
        <CardDescription className="text-center">
          Use our advanced filters to discover compatible life partners
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">I'm looking for</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gender</SelectLabel>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marital-status" className="text-sm font-medium">Marital status</Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger id="marital-status" className="w-full">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Marital Status</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Unmarried">Unmarried</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widow">Widow</SelectItem>
                  <SelectItem value="Widower">Widower</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <LocationSelector onLocationSelect={setLocationSelection} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biodata-number" className="text-sm font-medium">Biodata Number</Label>
            <Input
              id="biodata-number"
              placeholder="Enter biodata number"
              value={biodataNumber}
              onChange={(e) => setBiodataNumber(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-primary hover:bg-primary/90 transition-all duration-200"
          size="lg"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" /> Search Biodata
        </Button>
      </CardContent>
    </Card>
  );
}