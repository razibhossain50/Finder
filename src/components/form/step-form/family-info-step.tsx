'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface FamilyInfoStepProps {
  data: any;
  errors: any;
  updateData: (data: Partial<any>) => void;
}

export function FamilyInfoStep({ data, errors, updateData }: FamilyInfoStepProps) {
  const [ageRange, setAgeRange] = useState([data.partnerAgeMin || 25, data.partnerAgeMax || 35]);

  const handleAgeRangeChange = (values: number[]) => {
    setAgeRange(values);
    updateData({
      partnerAgeMin: values[0],
      partnerAgeMax: values[1],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-purple-600 to-purple-400 rounded-lg" />
          Family Information
        </h2>
        <p className="text-slate-500 mt-1">Tell us about your family background</p>
      </div>

      <div className="space-y-8">
        {/* Economic Condition */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="economicCondition">
            Family's Economic Condition <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.economicCondition || ""}
            onValueChange={(value) => updateData({ economicCondition: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Economic Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lower Class">Lower Class</SelectItem>
              <SelectItem value="Lower Middle Class">Lower Middle Class</SelectItem>
              <SelectItem value="Middle Class">Middle Class</SelectItem>
              <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
              <SelectItem value="Upper Class">Upper Class</SelectItem>
            </SelectContent>
          </Select>
          {errors.economicCondition && (
            <p className="text-sm text-red-500">{errors.economicCondition}</p>
          )}
        </div>

        {/* Father Information */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Father's Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="fatherName">
                Father's Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fatherName"
                placeholder="Enter father's name"
                value={data.fatherName || ""}
                onChange={(e) => updateData({ fatherName: e.target.value })}
              />
              {errors.fatherName && (
                <p className="text-sm text-red-500">{errors.fatherName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherProfession">
                Father's Profession <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fatherProfession"
                placeholder="Enter father's profession"
                value={data.fatherProfession || ""}
                onChange={(e) => updateData({ fatherProfession: e.target.value })}
              />
              {errors.fatherProfession && (
                <p className="text-sm text-red-500">{errors.fatherProfession}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherAlive">
                Is your father alive? <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.fatherAlive || ""}
                onValueChange={(value) => updateData({ fatherAlive: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.fatherAlive && (
                <p className="text-sm text-red-500">{errors.fatherAlive}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mother Information */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Mother's Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="motherName">
                Mother's Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="motherName"
                placeholder="Enter mother's name"
                value={data.motherName || ""}
                onChange={(e) => updateData({ motherName: e.target.value })}
              />
              {errors.motherName && (
                <p className="text-sm text-red-500">{errors.motherName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherProfession">
                Mother's Profession <span className="text-red-500">*</span>
              </Label>
              <Input
                id="motherProfession"
                placeholder="Enter mother's profession"
                value={data.motherProfession || ""}
                onChange={(e) => updateData({ motherProfession: e.target.value })}
              />
              {errors.motherProfession && (
                <p className="text-sm text-red-500">{errors.motherProfession}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherAlive">
                Is your mother alive? <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.motherAlive || ""}
                onValueChange={(value) => updateData({ motherAlive: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.motherAlive && (
                <p className="text-sm text-red-500">{errors.motherAlive}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Siblings Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="brothersCount">
              How many brothers do you have? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.brothersCount?.toString() || ""}
              onValueChange={(value) => updateData({ brothersCount: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Number" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brothersCount && (
              <p className="text-sm text-red-500">{errors.brothersCount}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sistersCount">
              How many sisters do you have? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.sistersCount?.toString() || ""}
              onValueChange={(value) => updateData({ sistersCount: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Number" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sistersCount && (
              <p className="text-sm text-red-500">{errors.sistersCount}</p>
            )}
          </div>
        </div>

        {/* Family Details */}
        <div className="space-y-2 mb-8">
          <Label htmlFor="familyDetails">
            Write details about yourself and your family
          </Label>
          <Textarea
            id="familyDetails"
            placeholder="Share any additional information about yourself and your family background"
            value={data.familyDetails || ""}
            onChange={(e) => updateData({ familyDetails: e.target.value })}
            rows={4}
          />
        </div>


      </div>
    </div>
  );
}
