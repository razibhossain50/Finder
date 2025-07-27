"use client";
import { BellRing as Ring, Stethoscope, Scale } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { use } from "react";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Profile</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Marriage Profile Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-rose-100 rounded-full w-fit">
                <Ring className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Marriage Profile</CardTitle>
              <CardDescription>Find your perfect life partner</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Detailed personal information</li>
                <li>• Family background details</li>
                <li>• Partner preferences</li>
                <li>• Photo gallery options</li>
              </ul>
              <Link
                className="block text-center p-2 rounded-lg w-full bg-rose-500 hover:bg-rose-600"
                href="/profile/marriage"
              >
                Create Marriage Profile
              </Link>
            </CardContent>
          </Card>

          {/* Doctor Profile Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Doctor Profile</CardTitle>
              <CardDescription>Showcase your medical expertise</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Medical qualifications</li>
                <li>• Specializations</li>
                <li>• Professional experience</li>
                <li>• Hospital affiliations</li>
              </ul>
              <Link
                className="block text-center p-2 rounded-lg w-full bg-blue-500 hover:bg-blue-600"
                href="/profile/marriage"
              >
                Create Doctor Profile
              </Link>
            </CardContent>
          </Card>

          {/* Lawyer Profile Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="mb-4 p-3 bg-emerald-100 rounded-full w-fit">
                <Scale className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Lawyer Profile</CardTitle>
              <CardDescription>Build your legal presence</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Legal expertise areas</li>
                <li>• Bar admissions</li>
                <li>• Case history</li>
                <li>• Law firm details</li>
              </ul>
              <Link
                className="block text-center p-2 rounded-lg w-full bg-emerald-500 hover:bg-emerald-600"
                href="/profile/marriage"
              >
                Create Lawyer Profile
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}