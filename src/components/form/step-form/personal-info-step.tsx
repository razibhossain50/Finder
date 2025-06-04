'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CascadingSelect } from "@/components/ui/cascading-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface PersonalInfoStepProps {
  data: any;
  errors: any;
  updateData: (data: Partial<any>) => void;
}

export function PersonalInfoStep({ data, errors, updateData }: PersonalInfoStepProps) {
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  useEffect(() => {
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setCalculatedAge(age);
      updateData({ age });
    }
  }, [data.dateOfBirth]);

  const handleSameAddressChange = (checked: boolean) => {
    updateData({ sameAsPermanent: checked });
    
    if (checked) {
      updateData({
        presentAddress: data.permanentAddress,
        presentCountry: data.permanentCountry,
        presentDivision: data.permanentDivision,
        presentZilla: data.permanentZilla,
        presentUpazilla: data.permanentUpazilla,
        presentArea: data.permanentArea,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="space-y-8">
        <div className="border-b pb-4 border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg" />
            Personal Information
          </h2>
          <p className="text-slate-500 mt-1">Please provide your personal details accurately</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Religion */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Religion <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.religion || ""}
                onValueChange={(value) => updateData({ religion: value })}
              >
                <SelectTrigger className="w-full" >
                  <SelectValue placeholder="Select Religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Christianity">Christianity</SelectItem>
                  <SelectItem value="Hinduism">Hinduism</SelectItem>
                  <SelectItem value="Buddhism">Buddhism</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.religion && (
              <p className="text-xs text-red-500 mt-1">{errors.religion}</p>
            )}
          </div>
          {/* Biodata Type */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Biodata Type <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.biodataType || ""}
                onValueChange={(value) => updateData({ biodataType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.biodataType && (
              <p className="text-xs text-red-500 mt-1">{errors.biodataType}</p>
            )}
          </div>
          {/* Marital Status */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Marital Status <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.maritalStatus || ""}
                onValueChange={(value) => updateData({ maritalStatus: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Unmarried">Unmarried</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widow">Widow</SelectItem>
                  <SelectItem value="Widower">Widower</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.maritalStatus && (
              <p className="text-xs text-red-500 mt-1">{errors.maritalStatus}</p>
            )}
          </div>
          {/* Date of Birth */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth || ""}
                onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                className="w-full"
              />
            </div>
            {calculatedAge !== null && (
              <p className="text-xs text-slate-500">Age: {calculatedAge} years</p>
            )}
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
          {/* Height */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Height <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.height || ""}
                onValueChange={(value) => updateData({ height: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below-4">Below 4 feet</SelectItem>
                  <SelectItem value="4.0">4'0"</SelectItem>
                  <SelectItem value="4.1">4'1"</SelectItem>
                  <SelectItem value="4.2">4'2"</SelectItem>
                  <SelectItem value="4.3">4'3"</SelectItem>
                  <SelectItem value="4.4">4'4"</SelectItem>
                  <SelectItem value="4.5">4'5"</SelectItem>
                  <SelectItem value="4.6">4'6"</SelectItem>
                  <SelectItem value="4.7">4'7"</SelectItem>
                  <SelectItem value="4.8">4'8"</SelectItem>
                  <SelectItem value="4.9">4'9"</SelectItem>
                  <SelectItem value="4.10">4'10"</SelectItem>
                  <SelectItem value="4.11">4'11"</SelectItem>
                  <SelectItem value="5.0">5'0"</SelectItem>
                  <SelectItem value="5.1">5'1"</SelectItem>
                  <SelectItem value="5.2">5'2"</SelectItem>
                  <SelectItem value="5.3">5'3"</SelectItem>
                  <SelectItem value="5.4">5'4"</SelectItem>
                  <SelectItem value="5.5">5'5"</SelectItem>
                  <SelectItem value="5.6">5'6"</SelectItem>
                  <SelectItem value="5.7">5'7"</SelectItem>
                  <SelectItem value="5.8">5'8"</SelectItem>
                  <SelectItem value="5.9">5'9"</SelectItem>
                  <SelectItem value="5.10">5'10"</SelectItem>
                  <SelectItem value="5.11">5'11"</SelectItem>
                  <SelectItem value="6.0">6'0"</SelectItem>
                  <SelectItem value="6.1">6'1"</SelectItem>
                  <SelectItem value="6.2">6'2"</SelectItem>
                  <SelectItem value="6.3">6'3"</SelectItem>
                  <SelectItem value="6.4">6'4"</SelectItem>
                  <SelectItem value="6.5">6'5"</SelectItem>
                  <SelectItem value="6.6">6'6"</SelectItem>
                  <SelectItem value="6.7">6'7"</SelectItem>
                  <SelectItem value="6.8">6'8"</SelectItem>
                  <SelectItem value="6.9">6'9"</SelectItem>
                  <SelectItem value="6.10">6'10"</SelectItem>
                  <SelectItem value="6.11">6'11"</SelectItem>
                  <SelectItem value="7.0">7'0"</SelectItem>
                  <SelectItem value="upper-7">Upper 7 feet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.height && (
              <p className="text-xs text-red-500 mt-1">{errors.height}</p>
            )}
          </div>
          {/* Weight */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Weight <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={data.weight || ""}
                onChange={(e) => updateData({ weight: parseInt(e.target.value) || "" })}
                className="pr-12 w-full"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-sm">kg</span>
              </div>
            </div>
            {errors.weight && (
              <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
            )}
          </div>
          {/* Skin Color */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Skin Color <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.skinColor || ""}
                onValueChange={(value) => updateData({ skinColor: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Skin Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Dusky">Dusky</SelectItem>
                  <SelectItem value="Wheatish">Wheatish</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Very Fair">Very Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.skinColor && (
              <p className="text-xs text-red-500 mt-1">{errors.skinColor}</p>
            )}
          </div>
          {/* Profession */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Profession <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="profession"
                placeholder="Enter your profession"
                value={data.profession || ""}
                onChange={(e) => updateData({ profession: e.target.value })}
                className="w-full"
              />
            </div>
            {errors.profession && (
              <p className="text-xs text-red-500 mt-1">{errors.profession}</p>
            )}
          </div>
          {/* Blood Group */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-slate-700">
              Blood Group <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                value={data.bloodGroup || ""}
                onValueChange={(value) => updateData({ bloodGroup: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.bloodGroup && (
              <p className="text-xs text-red-500 mt-1">{errors.bloodGroup}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Section */}
      <Card className="mt-8 border-0 shadow-md bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="border-b pb-4 border-gray-200">
          <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Permanent Address */}
          <div>
            <div className="rounded-lg bg-slate-50 p-4 shadow-inner">
              <CascadingSelect
                type="permanent"
                data={data}
                errors={errors}
                updateData={updateData}
              />
              <div className="mt-4 space-y-2">
                <Label htmlFor="permanentArea" className="font-medium text-slate-700">
                  Area or Village Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="permanentArea"
                  placeholder="Enter area or village name"
                  value={data.permanentArea || ""}
                  onChange={(e) => updateData({ permanentArea: e.target.value })}
                  className="w-full"
                />
                {errors.permanentArea && (
                  <p className="text-xs text-red-500">{errors.permanentArea}</p>
                )}
              </div>
            </div>
          </div>
          {/* Same Address Checkbox */}
          <div className="flex items-center space-x-2 px-2">
            <Checkbox
              id="sameAddress"
              checked={data.sameAsPermanent || false}
              onCheckedChange={handleSameAddressChange}
            />
            <Label htmlFor="sameAddress" className="text-sm text-slate-600">
              Present address is same as permanent address
            </Label>
          </div>
          {/* Present Address */}
          <div className={`${data.sameAsPermanent ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="rounded-lg bg-slate-50 p-4 shadow-inner">
              <CascadingSelect
                type="present"
                data={data}
                errors={errors}
                updateData={updateData}
              />
              <div className="mt-4 space-y-2">
                <Label htmlFor="presentArea" className="font-medium text-slate-700">
                  Area or Village Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="presentArea"
                  placeholder="Enter area or village name"
                  value={data.presentArea || ""}
                  onChange={(e) => updateData({ presentArea: e.target.value })}
                  className="w-full"
                />
                {errors.presentArea && (
                  <p className="text-xs text-red-500">{errors.presentArea}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Issues */}
      <div className="space-y-2">
        <Label htmlFor="healthIssues" className="font-medium text-slate-700">
          Do you have any physical or mental health issues? <span className="text-red-500">*</span>
        </Label>
        <div className="rounded-lg bg-white shadow-sm p-2">
          <Textarea
            id="healthIssues"
            placeholder="Please describe any health issues or write 'None' if you don't have any"
            value={data.healthIssues || ""}
            onChange={(e) => updateData({ healthIssues: e.target.value })}
            rows={3}
            className="w-full"
          />
        </div>
        {errors.healthIssues && (
          <p className="text-xs text-red-500">{errors.healthIssues}</p>
        )}
      </div>
    </div>
  );
}
