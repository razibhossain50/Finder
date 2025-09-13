'use client';
import { useState, useRef, useCallback } from 'react';
import { Input, Select, SelectItem, Textarea, Button, Checkbox, Card, CardBody, CardHeader, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip } from "@heroui/react";
import { User, Mail, Phone, MapPin, Award, FileText, Upload, GraduationCap, Briefcase, Clock, Crop as CropIcon, X, Check, Info } from "lucide-react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { LocationSelector } from '@/components/form/LocationSelector';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import { apiClient } from '@/lib/api-client';
import { FileUploadResponse } from '@/types/api';

const PROFESSIONAL_CATEGORIES = [
  { key: 'doctor', label: 'Doctor', icon: '🩺' },
  { key: 'teacher', label: 'Teacher', icon: '📚' },
  { key: 'engineer', label: 'Engineer', icon: '⚙️' },
  { key: 'lawyer', label: 'Lawyer', icon: '⚖️' }
];

const GENDER_OPTIONS = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' }
];

const EDUCATION_LEVELS = [
  // General
  { key: 'diploma', label: 'Diploma' },
  { key: 'certificate', label: 'Certificate' },
  { key: 'bachelor', label: "Bachelor's Degree (BA, BSc, etc.)" },
  { key: 'master', label: "Master's Degree (MA, MSc, etc.)" },
  { key: 'phd', label: 'PhD / Doctorate' },

  // Medical (Doctors)
  { key: 'mbbs', label: 'MBBS' },
  { key: 'md', label: 'MD (Doctor of Medicine)' },
  { key: 'fcps', label: 'FCPS (Fellowship of the College of Physicians & Surgeons)' },
  { key: 'dch', label: 'DCH (Diploma in Child Health)' },
  { key: 'bds', label: 'BDS (Bachelor of Dental Surgery)' },
  { key: 'ms_surgery', label: 'MS (Master of Surgery)' },

  // Law (Lawyers)
  { key: 'llb', label: 'LLB (Bachelor of Laws)' },
  { key: 'llm', label: 'LLM (Master of Laws)' },
  { key: 'jd', label: 'JD (Juris Doctor)' },
  { key: 'bar_at_law', label: 'Bar-at-Law' },

  // Engineering
  { key: 'bsc_engineering', label: 'BSc in Engineering' },
  { key: 'msc_engineering', label: 'MSc in Engineering' },
  { key: 'btech', label: 'B.Tech' },
  { key: 'mtech', label: 'M.Tech' },

  // Teaching / Education
  { key: 'bed', label: 'B.Ed (Bachelor of Education)' },
  { key: 'med', label: 'M.Ed (Master of Education)' },

  // Other Professional
  { key: 'professional', label: 'Professional Degree (CPA, CA, etc.)' },
  { key: 'other', label: 'Other' }
];


// Specializations by category
const SPECIALIZATIONS = {
  doctor: [
    { key: 'cardiology', label: 'Cardiology' },
    { key: 'neurology', label: 'Neurology' },
    { key: 'pediatrics', label: 'Pediatrics' },
    { key: 'orthopedics', label: 'Orthopedics' },
    { key: 'dermatology', label: 'Dermatology' },
    { key: 'psychiatry', label: 'Psychiatry' },
    { key: 'general_medicine', label: 'General Medicine' },
    { key: 'surgery', label: 'Surgery' },
    { key: 'gynecology', label: 'Gynecology' },
    { key: 'ophthalmology', label: 'Ophthalmology' }
  ],
  teacher: [
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
    { key: 'english', label: 'English' },
    { key: 'bangla', label: 'Bangla' },
    { key: 'history', label: 'History' },
    { key: 'geography', label: 'Geography' },
    { key: 'computer_science', label: 'Computer Science' },
    { key: 'economics', label: 'Economics' }
  ],
  engineer: [
    { key: 'software', label: 'Software Engineering' },
    { key: 'civil', label: 'Civil Engineering' },
    { key: 'mechanical', label: 'Mechanical Engineering' },
    { key: 'electrical', label: 'Electrical Engineering' },
    { key: 'chemical', label: 'Chemical Engineering' },
    { key: 'aerospace', label: 'Aerospace Engineering' },
    { key: 'industrial', label: 'Industrial Engineering' },
    { key: 'environmental', label: 'Environmental Engineering' }
  ],
  lawyer: [
    { key: 'corporate', label: 'Corporate Law' },
    { key: 'criminal', label: 'Criminal Law' },
    { key: 'family', label: 'Family Law' },
    { key: 'tax', label: 'Tax Law' },
    { key: 'labor', label: 'Labor Law' },
    { key: 'intellectual_property', label: 'Intellectual Property' },
    { key: 'real_estate', label: 'Real Estate Law' },
    { key: 'immigration', label: 'Immigration Law' }
  ]
};

export default function ProfessionalProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image cropping states
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    // Profile Type
    profileType: 'doctor',

    // Profile Information
    fullName: '',
    gender: '',
    profilePicture: null as File | null,
    highestEducation: '',
    instituteName: '',
    passingYear: '',
    bmdcRegistration: '', // Only for doctors
    yearsOfExperience: '',
    designation: '',
    specializations: [] as string[], // Multi-select

    // Workplace Information
    workplaceLocation: '',
    workplaceAddress: '',
    availability: '',
    description: '',

    // Contact Information
    appointmentContactNumber: '',
    personalNumber: '', // Admin use only
    personalEmail: '', // Admin use only

    // Agreement
    termsAccepted: false,
    verificationConsent: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkplaceChange = (locationString: string) => {
    setFormData(prev => ({
      ...prev,
      workplaceLocation: locationString
    }));
  };

  const handleSpecializationChange = (keys: any) => {
    const selectedKeys = Array.from(keys) as string[];
    setFormData(prev => ({
      ...prev,
      specializations: selectedKeys
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const getAvailableSpecializations = () => {
    if (!formData.profileType) return [];
    return SPECIALIZATIONS[formData.profileType as keyof typeof SPECIALIZATIONS] || [];
  };

  // Helper function to create initial crop
  const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  // Handle image load in crop modal
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1)); // 1:1 aspect ratio for profile pictures
  }, []);

  // Generate cropped image
  const getCroppedImg = useCallback(async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }, []);

  // Handle crop confirmation
  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      setIsUploading(true);
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);

      // Create a File object from the blob
      const croppedFile = new File([croppedImageBlob], 'cropped-profile.jpg', {
        type: 'image/jpeg',
      });

      // Upload the cropped file
      const result = await apiClient.uploadFile('/api/upload/profile-picture', croppedFile, 'profilePicture') as FileUploadResponse;

      // Create preview URL
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setPreviewUrl(previewUrl);
      handleInputChange('profilePicture', result.url);

      setShowCropModal(false);
      logger.debug('File uploaded successfully', result, 'Professional-profile');
    } catch (error) {
      const appError = handleApiError(error, 'Component');
      logger.error('Upload error', appError, 'Professional-profile');
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    setPreviewUrl('');
    handleInputChange('profilePicture', null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Get the image URL to display (either from local preview or saved data)
  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (formData.profilePicture && typeof formData.profilePicture === 'string') return formData.profilePicture;
    return null;
  };

  // Check if we have an image (either uploaded in this session or previously saved)
  const hasImage = () => {
    return !!(previewUrl || (formData.profilePicture && typeof formData.profilePicture === 'string'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Professional profile data:', formData);
      setIsSubmitting(false);
      // Redirect to success page or dashboard
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Profile
          </h1>
          <p className="text-lg text-gray-600">
            Create your professional profile and connect with clients who need your expertise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Profile Information */}
          <Card className='p-4'>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  className='md:col-span-2'
                  label="Select Profile Type"
                  placeholder="Choose your profession"
                  selectedKeys={formData.profileType ? [formData.profileType] : []}
                  onSelectionChange={(keys) => handleInputChange('profileType', Array.from(keys)[0])}
                  isRequired
                >
                  {PROFESSIONAL_CATEGORIES.map((category) => (
                    <SelectItem
                      key={category.key}
                      startContent={<span className="text-lg">{category.icon}</span>}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  isRequired
                  startContent={<User className="w-4 h-4 text-gray-400" />}
                />

                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={formData.gender ? [formData.gender] : []}
                  onSelectionChange={(keys) => handleInputChange('gender', Array.from(keys)[0])}
                  isRequired
                >
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.key}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Categories"
                  placeholder="Select education level"
                  selectedKeys={formData.highestEducation ? [formData.highestEducation] : []}
                  onSelectionChange={(keys) => handleInputChange('highestEducation', Array.from(keys)[0])}
                  isRequired
                  startContent={<GraduationCap className="w-4 h-4 text-gray-400" />}
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.key}>
                      {level.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Institute Name"
                  placeholder="Enter institute/university name"
                  value={formData.instituteName}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  isRequired
                  startContent={<GraduationCap className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Passing Year"
                  placeholder="Enter passing year"
                  value={formData.passingYear}
                  onChange={(e) => handleInputChange('passingYear', e.target.value)}
                  isRequired
                  type="number"
                  min="1950"
                  max="2030"
                />

                {formData.profileType === 'doctor' && (
                  <Input
                    label="BMDC Registration Number"
                    placeholder="Enter BMDC registration number"
                    value={formData.bmdcRegistration}
                    onChange={(e) => handleInputChange('bmdcRegistration', e.target.value)}
                    isRequired
                    startContent={<Award className="w-4 h-4 text-gray-400" />}
                  />
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Years of Experience"
                  placeholder="Enter years of experience"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  isRequired
                  type="number"
                  min="0"
                  max="50"
                  startContent={<Briefcase className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  label="Designation"
                  placeholder="e.g., Consultant, Assistant Professor"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  isRequired
                  startContent={<Award className="w-4 h-4 text-gray-400" />}
                />
                {/* Specialization Multi-select */}
                {formData.profileType && (
                  <Select
                    label="Specialization"
                    placeholder="Select your specializations"
                    selectedKeys={formData.specializations}
                    onSelectionChange={handleSpecializationChange}
                    selectionMode="multiple"
                    isRequired
                  >
                    {getAvailableSpecializations().map((spec) => (
                      <SelectItem key={spec.key}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
                {/* Profile Picture Upload */}
                <div className='col-span-2'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('profilePicture', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              
            </CardBody>
          </Card>

          {/* Workplace Information */}
          <Card className='p-4'>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Workplace Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <LocationSelector
                  onLocationSelect={handleWorkplaceChange}
                  value={formData.workplaceLocation}
                  label="Select Workplace Location"
                  placeholder="Choose workplace location"
                  isRequired={true}
                />
              </div>

              <Input
                label="Workplace Address"
                placeholder="Enter complete workplace address"
                value={formData.workplaceAddress}
                onChange={(e) => handleInputChange('workplaceAddress', e.target.value)}
                isRequired
                startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              />

              <Textarea
                label="Availability (Visiting Hours/Days)"
                placeholder="e.g., Mon-Fri 9AM-5PM, Sat 9AM-1PM"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                isRequired
                minRows={4}
                startContent={<Clock className="w-4 h-4 text-gray-400" />}
              />

              <Textarea
                label="Details About You"
                placeholder="Write a short bio/description about yourself, your expertise, and experience..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                isRequired
                minRows={4}

              />
            </CardBody>
          </Card>

          {/* Contact Information */}
          <Card className='p-4'>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Appointment Contact Number"
                placeholder="Enter contact number for appointments"
                value={formData.appointmentContactNumber}
                onChange={(e) => handleInputChange('appointmentContactNumber', e.target.value)}
                isRequired
                startContent={<Phone className="w-4 h-4 text-gray-400" />}
              />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 mb-3 font-medium">
                  Admin Use Only - These details will not be publicly visible
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Personal Number (Admin Only)"
                    placeholder="Enter personal contact number"
                    value={formData.personalNumber}
                    onChange={(e) => handleInputChange('personalNumber', e.target.value)}
                    startContent={<Phone className="w-4 h-4 text-gray-400" />}
                  />

                  <Input
                    label="Personal Email (Admin Only)"
                    type="email"
                    placeholder="Enter personal email"
                    value={formData.personalEmail}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="px-12"
              isLoading={isSubmitting}
              isDisabled={!formData.termsAccepted || !formData.verificationConsent}
            >
              {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Your profile will be reviewed within 2-3 business days.
              You'll receive an email notification once approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}