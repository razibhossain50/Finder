"use client";
import { useState, useEffect, useCallback } from "react";
import {
  User,
  Heart,
  GraduationCap,
  Briefcase,
  MapPin,
  Users,
  Phone,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Droplets,
  Shield,
  Home,
  Edit,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegularAuth } from "@/context/RegularAuthContext";
import Image from "next/image";
import Link from "next/link";

interface BiodataProfile {
  id: number;
  step: number;
  userId: number | null;
  completedSteps: number | null;
  partnerAgeMin: number;
  partnerAgeMax: number;
  sameAsPermanent: boolean;
  religion: string;
  biodataType: string;
  maritalStatus: string;
  dateOfBirth: string;
  age: number;
  height: string;
  weight: number;
  complexion: string;
  profession: string;
  bloodGroup: string;
  permanentCountry: string;
  permanentDivision: string;
  permanentZilla: string;
  permanentUpazilla: string;
  permanentArea: string;
  presentCountry: string;
  presentDivision: string;
  presentZilla: string;
  presentUpazilla: string;
  presentArea: string;
  healthIssues: string;
  educationMedium: string;
  highestEducation: string;
  instituteName: string;
  subject: string;
  passingYear: number;
  result: string;
  economicCondition: string;
  fatherName: string;
  fatherProfession: string;
  fatherAlive: string;
  motherName: string;
  motherProfession: string;
  motherAlive: string;
  brothersCount: number;
  sistersCount: number;
  familyDetails: string;
  partnerComplexion: string;
  partnerHeight: string;
  partnerEducation: string;
  partnerProfession: string;
  partnerLocation: string;
  partnerDetails: string;
  fullName: string;
  profilePicture: string | null;
  email: string;
  guardianMobile: string;
  ownMobile: string;
  status: string | null;
}

// Helper function to safely display data or fallback
const safeDisplay = (value: unknown, fallback: string = "Not provided"): string => {
  if (value === null || value === undefined || value === "" || value === "null") {
    return fallback;
  }
  return String(value);
};

// Helper function to format date safely
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return "Invalid date";
  }
};

export default function Profile() {
  const [profile, setProfile] = useState<BiodataProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useRegularAuth();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('regular_access_token');

      // Get current user's biodata using the correct endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No biodata found for this user
          setProfile(null);
          setError("No biodata found. Please create your profile first.");
        } else {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  const handleRetry = () => {
    setLoading(true);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
        <div className="container max-w-6xl mx-auto space-y-8">
          <div className="text-center py-12">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-left">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-x-4">
              <Button onClick={handleRetry} variant="default" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
        <div className="container max-w-6xl mx-auto space-y-8">
          <div className="text-center py-12">
            <div className="space-y-4">
              <User className="h-16 w-16 text-gray-400 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">No Profile Found</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven&apos;t created your biodata profile yet. Create one to get started with finding your perfect match.
              </p>
              <Button variant="default" className="mt-4">
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Complete biodata information</p>
          </div>
          <Button asChild variant="default" >
            <Link href="/profile/marriage" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{safeDisplay(profile.fullName, user?.fullName || "Unknown User")}</h2>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {profile.age || "N/A"} years old
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {safeDisplay(profile.presentDivision)}, {safeDisplay(profile.presentCountry)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {safeDisplay(profile.biodataType)}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {safeDisplay(profile.maritalStatus)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-lg">{formatDate(profile.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p className="text-lg">{safeDisplay(profile.age)} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Height</p>
                    <p className="text-lg flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      {safeDisplay(profile.height)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p className="text-lg flex items-center gap-1">
                      <Weight className="h-4 w-4 text-gray-400" />
                      {safeDisplay(profile.weight)} {profile.weight ? 'kg' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Complexion</p>
                    <p className="text-lg">{safeDisplay(profile.complexion)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Group</p>
                    <p className="text-lg flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-red-500" />
                      {safeDisplay(profile.bloodGroup)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Religion</p>
                    <p className="text-lg">{safeDisplay(profile.religion)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marital Status</p>
                    <p className="text-lg">{safeDisplay(profile.maritalStatus)}</p>
                  </div>
                </div>
                {profile.healthIssues && safeDisplay(profile.healthIssues) !== "Not provided" && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Health Issues</p>
                    <p className="text-lg flex items-start gap-1">
                      <Shield className="h-4 w-4 text-gray-400 mt-1" />
                      {safeDisplay(profile.healthIssues)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-500" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {safeDisplay(profile.email, user?.email || "Not provided")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Own Mobile</p>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {safeDisplay(profile.ownMobile)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Guardian Mobile</p>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {safeDisplay(profile.guardianMobile)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-500" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education Medium</p>
                    <p className="text-lg">{safeDisplay(profile.educationMedium)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Highest Education</p>
                    <p className="text-lg">{safeDisplay(profile.highestEducation)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Institute</p>
                    <p className="text-lg">{safeDisplay(profile.instituteName)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subject</p>
                    <p className="text-lg">{safeDisplay(profile.subject)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Passing Year</p>
                    <p className="text-lg">{safeDisplay(profile.passingYear)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Result</p>
                    <p className="text-lg">{safeDisplay(profile.result)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Profession</p>
                  <p className="text-lg">{safeDisplay(profile.profession)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Economic Condition</p>
                  <p className="text-lg">{safeDisplay(profile.economicCondition)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-indigo-500" />
                Permanent Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{safeDisplay(profile.permanentArea)}, {safeDisplay(profile.permanentUpazilla)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{safeDisplay(profile.permanentZilla)}, {safeDisplay(profile.permanentDivision)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{safeDisplay(profile.permanentCountry)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                Present Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.sameAsPermanent ? (
                  <p className="text-gray-600 italic">Same as permanent address</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{safeDisplay(profile.presentArea)}, {safeDisplay(profile.presentUpazilla)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{safeDisplay(profile.presentZilla)}, {safeDisplay(profile.presentDivision)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{safeDisplay(profile.presentCountry)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Family Information */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-500" />
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Father&apos;s Name</p>
                    <p className="text-lg">{safeDisplay(profile.fatherName)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Father&apos;s Profession</p>
                    <p className="text-lg">{safeDisplay(profile.fatherProfession)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Father Status</p>
                    <p className="text-lg">{profile.fatherAlive === 'Yes' ? 'Alive' : profile.fatherAlive === 'No' ? 'Deceased' : safeDisplay(profile.fatherAlive)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mother&apos;s Name</p>
                    <p className="text-lg">{safeDisplay(profile.motherName)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mother&apos;s Profession</p>
                    <p className="text-lg">{safeDisplay(profile.motherProfession)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mother Status</p>
                    <p className="text-lg">{profile.motherAlive === 'Yes' ? 'Alive' : profile.motherAlive === 'No' ? 'Deceased' : safeDisplay(profile.motherAlive)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Brothers</p>
                    <p className="text-lg">{safeDisplay(profile.brothersCount, "0")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sisters</p>
                    <p className="text-lg">{safeDisplay(profile.sistersCount, "0")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Family Details</p>
                  <p className="text-lg">{safeDisplay(profile.familyDetails)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Preferences */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Partner Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age Range</p>
                    <p className="text-lg">{safeDisplay(profile.partnerAgeMin)} - {safeDisplay(profile.partnerAgeMax)} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Complexion</p>
                    <p className="text-lg">{safeDisplay(profile.partnerComplexion)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Height</p>
                    <p className="text-lg">{safeDisplay(profile.partnerHeight)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education</p>
                    <p className="text-lg">{safeDisplay(profile.partnerEducation)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Profession</p>
                  <p className="text-lg">{safeDisplay(profile.partnerProfession)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg">{safeDisplay(profile.partnerLocation)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Additional Details</p>
                  <p className="text-lg">{safeDisplay(profile.partnerDetails)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}