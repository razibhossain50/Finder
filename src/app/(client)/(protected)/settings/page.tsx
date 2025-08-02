"use client";
import { useState, useEffect } from "react";
import { Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRegularAuth } from "@/context/RegularAuthContext";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user } = useRegularAuth();

  // Prefill form with current user data
  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);



  const handleSaveChanges = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('regular_access_token');
      console.log('Token from localStorage:', token);
      console.log('User ID:', user.id);
      console.log('Request URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage with new user data
      const updatedUser = { ...user, fullName: name, email: email };
      localStorage.setItem('regular_user', JSON.stringify(updatedUser));

      setMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>


        {message && (
          <div className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-500" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/settings/reset-password')}
            >
              Reset Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}