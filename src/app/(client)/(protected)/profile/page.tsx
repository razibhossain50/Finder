"use client";
import { User, Camera, Edit, Save, MapPin, Calendar, Heart, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRegularAuth } from "@/context/RegularAuthContext";

export default function Profile() {
  const { user } = useRegularAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information</p>
          </div>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a clear, recent photo of yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-500" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-emerald-500" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your basic profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  defaultValue={user?.fullName || ''} 
                  placeholder="Your full name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="location" className="pl-10" placeholder="City, Country" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" placeholder="Your profession" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              About Me
            </CardTitle>
            <CardDescription>
              Tell others about yourself, your interests, and what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Write a brief description about yourself..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Interests & Hobbies</Label>
                <Input id="interests" placeholder="Reading, traveling, cooking, music..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="looking-for">What I'm Looking For</Label>
                <Textarea 
                  id="looking-for" 
                  placeholder="Describe your ideal partner and relationship goals..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-500 rounded-full p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700">247</div>
              <p className="text-blue-600">Profile Views</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-rose-500 rounded-full p-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-700">36</div>
              <p className="text-rose-600">Likes Received</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-emerald-500 rounded-full p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-700">4.8</div>
              <p className="text-emerald-600">Profile Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}