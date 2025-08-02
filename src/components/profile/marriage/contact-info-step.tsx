'use client';
import { Input, Card, CardBody, Tooltip } from "@heroui/react";
import { Info, Upload } from "lucide-react";
import { useState } from "react";

interface ContactInfoStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function ContactInfoStep({ data, errors, updateData }: ContactInfoStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Please upload only JPEG or PNG images.");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }

      setUploadedFile(file);
      updateData({ profilePicture: file.name });
    }
  };

  return (
    <div className="p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-lg" />
          Contact Information
        </h2>
        <p className="text-slate-500 mt-1">Provide your contact details securely</p>
      </div>

      <div className="space-y-8">


        {/* Contact details grid */}
        <div className="grid gap-x-8 gap-y-6">
          {/* Name with Admin Note */}
          <div className="col-span-2 mb-6">
            <Input
              label={
                <div className="flex items-center gap-2">
                  Your full name
                  <Tooltip content="Only visible for admin">
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  </Tooltip>
                </div>
              }
              placeholder="Enter full name"
              value={(data.fullName as string) || ""}
              onChange={(e) => updateData({ fullName: e.target.value })}
              isRequired
              errorMessage={errors.fullName}
              isInvalid={!!errors.fullName}
              description={
                <div className="flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Only visible for admin
                </div>
              }
            />
          </div>

          {/* Profile Picture */}
          <div className="col-span-2 space-y-2 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Profile Picture</span>
              <Tooltip content="Only visible for admin and who bought the connection. Only JPEG/PNG Image">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
              </Tooltip>
            </div>

            <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <CardBody className="p-6">
                <div className="text-center">
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-500">File uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <label htmlFor="profilePicture" className="cursor-pointer">
                          <span className="text-primary hover:text-primary/80 font-medium">
                            Click to upload
                          </span>
                          <span className="text-slate-500"> or drag and drop</span>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG or JPG (max. 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                  />
                </div>
              </CardBody>
            </Card>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Only visible for admin and who bought the connection
            </p>
          </div>

          {/* Email */}
          <Input
            type="email"
            label="Email"
            placeholder="Enter email address"
            value={(data.email as string) || ""}
            onChange={(e) => updateData({ email: e.target.value })}
            isRequired
            errorMessage={errors.email}
            isInvalid={!!errors.email}
          />

          {/* Guardian's Mobile */}
          <Input
            type="tel"
            label="Guardian's Mobile Number"
            placeholder="Enter guardian's mobile number"
            value={(data.guardianMobile as string) || ""}
            onChange={(e) => updateData({ guardianMobile: e.target.value })}
            isRequired
            errorMessage={errors.guardianMobile}
            isInvalid={!!errors.guardianMobile}
          />

          {/* Own Mobile */}
          <div className="md:col-span-2">
            <Input
              type="tel"
              label="Own Mobile Number"
              placeholder="Enter your mobile number"
              value={(data.ownMobile as string) || ""}
              onChange={(e) => updateData({ ownMobile: e.target.value })}
              isRequired
              errorMessage={errors.ownMobile}
              isInvalid={!!errors.ownMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
