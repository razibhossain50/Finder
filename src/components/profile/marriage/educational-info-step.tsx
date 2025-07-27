import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationalInfoStepProps {
  data: any;
  errors: any;
  updateData: (data: Partial<any>) => void;
}

export function EducationalInfoStep({ data, errors, updateData }: EducationalInfoStepProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg" />
          Educational Information
        </h2>
        <p className="text-slate-500 mt-1">Share your educational background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Education Medium */}
        <div className="space-y-2">
          <Label htmlFor="educationMedium">
            Your Education Medium <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.educationMedium || ""}
            onValueChange={(value) => updateData({ educationMedium: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangla">Bangla</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
          {errors.educationMedium && (
            <p className="text-sm text-red-500">{errors.educationMedium}</p>
          )}
        </div>

        {/* Highest Education Level */}
        <div className="space-y-2">
          <Label htmlFor="highestEducation">
            Highest Education Level <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.highestEducation || ""}
            onValueChange={(value) => updateData({ highestEducation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below SSC">Below SSC</SelectItem>
              <SelectItem value="SSC">SSC</SelectItem>
              <SelectItem value="HSC">HSC</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Diploma Running">Diploma Running</SelectItem>
              <SelectItem value="Honours">Honours</SelectItem>
              <SelectItem value="Honours Running">Honours Running</SelectItem>
              <SelectItem value="Masters">Masters</SelectItem>
              <SelectItem value="Masters Running">Masters Running</SelectItem>
              <SelectItem value="PHD">PHD</SelectItem>
            </SelectContent>
          </Select>
          {errors.highestEducation && (
            <p className="text-sm text-red-500">{errors.highestEducation}</p>
          )}
        </div>

        {/* Institute Name */}
        <div className="space-y-2">
          <Label htmlFor="instituteName">
            Institute or University Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="instituteName"
            placeholder="Enter institute or university name"
            value={data.instituteName || ""}
            onChange={(e) => updateData({ instituteName: e.target.value })}
          />
          {errors.instituteName && (
            <p className="text-sm text-red-500">{errors.instituteName}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">
            Which subject do you study
          </Label>
          <Input
            id="subject"
            placeholder="Enter your subject/major"
            value={data.subject || ""}
            onChange={(e) => updateData({ subject: e.target.value })}
          />
        </div>

        {/* Passing Year */}
        <div className="space-y-2">
          <Label htmlFor="passingYear">
            Passing Year <span className="text-red-500">*</span>
          </Label>
          <Input
            id="passingYear"
            type="number"
            placeholder="Enter passing year"
            min="1950"
            max="2030"
            value={data.passingYear || ""}
            onChange={(e) => updateData({ passingYear: parseInt(e.target.value) || "" })}
          />
          {errors.passingYear && (
            <p className="text-sm text-red-500">{errors.passingYear}</p>
          )}
        </div>

        {/* Result */}
        <div className="space-y-2">
          <Label htmlFor="result">
            Result <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.result || ""}
            onValueChange={(value) => updateData({ result: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="C+">C+</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
          {errors.result && (
            <p className="text-sm text-red-500">{errors.result}</p>
          )}
        </div>
      </div>
    </div>
  );
}
