export type ProfessionalCategory = 'doctor' | 'teacher' | 'engineer' | 'lawyer';

export interface Professional {
  id: number;
  userId?: number;
  
  // Basic Information
  name: string;
  email: string;
  phone: string;
  category: ProfessionalCategory;
  specialization: string;
  experience: number;
  location: string;
  
  // Professional Details
  qualifications: string[];
  description: string;
  services: string[];
  consultationFee?: number;
  availability: string;
  languages: string[];
  
  // Media
  profilePicture?: string;
  certificates?: string[];
  
  // Status & Ratings
  verified: boolean;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  rating: number;
  totalReviews: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Statistics
  profileViews?: number;
  messagesReceived?: number;
  appointmentsBooked?: number;
}

export interface ProfessionalFilters {
  category?: ProfessionalCategory | 'all';
  location?: string;
  experience?: string;
  specialization?: string;
  rating?: number;
  consultationFeeMin?: number;
  consultationFeeMax?: number;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export interface ProfessionalReview {
  id: number;
  professionalId: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ProfessionalStats {
  totalProfessionals: number;
  totalByCategory: Record<ProfessionalCategory, number>;
  averageRating: number;
  totalReviews: number;
}

export interface ProfessionalRegistrationData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  category: ProfessionalCategory;
  specialization: string;
  experience: string;
  location: string;
  
  // Professional Details
  qualifications: string;
  description: string;
  services: string;
  consultationFee: string;
  availability: string;
  
  // Documents
  profilePicture: File | null;
  certificates: File | null;
  
  // Agreement
  termsAccepted: boolean;
  verificationConsent: boolean;
}

export const PROFESSIONAL_CATEGORIES: Record<ProfessionalCategory, {
  label: string;
  icon: string;
  color: string;
  lightColor: string;
  description: string;
}> = {
  doctor: {
    label: 'Doctor',
    icon: '🩺',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    description: 'Medical professionals and healthcare providers'
  },
  teacher: {
    label: 'Teacher',
    icon: '📚',
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    description: 'Educators, tutors, and academic professionals'
  },
  engineer: {
    label: 'Engineer',
    icon: '⚙️',
    color: 'bg-orange-600',
    lightColor: 'bg-orange-50',
    description: 'Technical and engineering professionals'
  },
  lawyer: {
    label: 'Lawyer',
    icon: '⚖️',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    description: 'Legal professionals and attorneys'
  }
};

export const EXPERIENCE_LEVELS = [
  { key: '0-1', label: '0-1 years', min: 0, max: 1 },
  { key: '2-3', label: '2-3 years', min: 2, max: 3 },
  { key: '4-5', label: '4-5 years', min: 4, max: 5 },
  { key: '6-10', label: '6-10 years', min: 6, max: 10 },
  { key: '11-15', label: '11-15 years', min: 11, max: 15 },
  { key: '15+', label: '15+ years', min: 15, max: 100 }
];

export const BANGLADESH_LOCATIONS = [
  { key: 'dhaka', label: 'Dhaka' },
  { key: 'chittagong', label: 'Chittagong' },
  { key: 'sylhet', label: 'Sylhet' },
  { key: 'rajshahi', label: 'Rajshahi' },
  { key: 'khulna', label: 'Khulna' },
  { key: 'barisal', label: 'Barisal' },
  { key: 'rangpur', label: 'Rangpur' },
  { key: 'mymensingh', label: 'Mymensingh' },
  { key: 'comilla', label: 'Comilla' },
  { key: 'gazipur', label: 'Gazipur' },
  { key: 'narayanganj', label: 'Narayanganj' },
  { key: 'cox-bazar', label: 'Cox\'s Bazar' }
];

// Utility functions
export const getCategoryConfig = (category: ProfessionalCategory) => {
  return PROFESSIONAL_CATEGORIES[category];
};

export const getCategoryColor = (category: ProfessionalCategory) => {
  const colors = {
    doctor: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    engineer: 'bg-orange-100 text-orange-800',
    lawyer: 'bg-purple-100 text-purple-800'
  };
  return colors[category];
};

export const getCategoryIcon = (category: ProfessionalCategory) => {
  return PROFESSIONAL_CATEGORIES[category].icon;
};

export const formatExperience = (years: number): string => {
  if (years === 0) return 'Fresh Graduate';
  if (years === 1) return '1 year';
  return `${years} years`;
};

export const formatConsultationFee = (fee: number): string => {
  return `৳${fee.toLocaleString()}`;
};