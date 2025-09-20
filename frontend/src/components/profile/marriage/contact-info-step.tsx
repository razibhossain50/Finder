'use client';
import { Input, Card, CardBody, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Info, Upload, Crop as CropIcon, X, Check } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { logger } from '@/services/logger';
import { handleApiError } from '@/services/error-handler';
import { apiClient } from '@/services/api-client';
import { FileUploadResponse } from '@/types/api';

interface ContactInfoStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function ContactInfoStep({ data, errors, updateData }: ContactInfoStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setUploadedFile(croppedFile);
      updateData({ profilePicture: result.url });

      setShowCropModal(false);
      logger.debug('File uploaded successfully', result, 'Contact-info-step');
    } catch (error) {
      const appError = handleApiError(error, 'Component');
      logger.error('Upload error', appError, 'Contact-info-step');
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreviewUrl('');
    updateData({ profilePicture: null });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Get the image URL to display (either from local preview or saved data)
  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (data.profilePicture && typeof data.profilePicture === 'string') return data.profilePicture;
    return null;
  };

  // Check if we have an image (either uploaded in this session or previously saved)
  const hasImage = () => {
    return !!(previewUrl || (data.profilePicture && typeof data.profilePicture === 'string'));
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-lg" />
          Contact Information
        </h2>
        <p className="text-slate-500 mt-1">Provide your contact details securely</p>
      </div>

      <div className="space-y-8">


        {/* Contact details grid */}
        <div className="grid gap-4">
          {/* Name with Admin Note */}
          <div className="col-span-2">
            <Input
              label="Your full name"
              placeholder="Enter full name"
              value={(data.fullName as string) || ""}
              onChange={(e) => updateData({ fullName: e.target.value })}
              isRequired
              errorMessage={errors.fullName}
              isInvalid={!!errors.fullName}
              description={
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Info className="w-3 h-3" />
                  Use profile picture for more Visibility
                </div>
              }
              endContent={
                <Tooltip content="Only visible for admin">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                </Tooltip>
              }
            />
          </div>

          {/* Profile Picture */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Profile Picture</span>
              <Tooltip content="Profile pic is optional. Only JPEG/PNG Image. You can crop after upload.">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
              </Tooltip>
            </div>

            <Card className={`border-2 border-dashed transition-colors ${isUploading ? 'border-blue-300 bg-blue-50' :
              hasImage() ? 'border-emerald-300 bg-emerald-50' :
                'border-slate-300 hover:border-slate-400'
              }`}>
              <CardBody className="p-6">
                <div className="text-center">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm font-medium text-blue-900">Processing...</p>
                      <p className="text-xs text-blue-600">Please wait while we process your image</p>
                    </div>
                  ) : hasImage() ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-emerald-200">
                        <img
                          src={getImageUrl()!}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-emerald-900">Profile picture uploaded</p>
                        <p className="text-xs text-emerald-600">✓ Image processed successfully</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const imageUrl = getImageUrl();
                              if (imageUrl) {
                                setImageSrc(imageUrl);
                                setShowCropModal(true);
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                          >
                            <CropIcon className="w-3 h-3" />
                            Crop again
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-xs text-slate-500 hover:text-slate-700 underline flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
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
                      <p className="text-xs text-slate-400">You'll be able to crop after selecting</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>
              </CardBody>
            </Card>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Profile pic is optional. You can crop and adjust after upload.
            </p>
          </div>

          {/* Email */}
          <div className="col-span-2">
            <Input
              className="col-span-2"
              type="email"
              label="Email"
              placeholder="Enter email address"
              value={(data.email as string) || ""}
              onChange={(e) => updateData({ email: e.target.value })}
              isRequired
              errorMessage={errors.email}
              isInvalid={!!errors.email}
            />
          </div>

          {/* Guardian's Mobile */}
          <div className="col-span-2">
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
          </div>

          {/* Own Mobile */}
          <div className="col-span-2">
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

      {/* Crop Modal */}
      <Modal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Crop Your Profile Picture</h3>
            <p className="text-sm text-slate-500">Adjust the crop area to get the perfect profile picture</p>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="space-y-4">
              {imageSrc && (
                <div className="max-h-96 overflow-hidden rounded-lg border">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    minWidth={100}
                    minHeight={100}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={imageSrc}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto"
                    />
                  </ReactCrop>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Drag the corners to adjust the crop area. The image will be cropped to a perfect circle.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setShowCropModal(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCropConfirm}
              disabled={!completedCrop || isUploading}
              startContent={isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            >
              {isUploading ? 'Processing...' : 'Crop & Upload'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
