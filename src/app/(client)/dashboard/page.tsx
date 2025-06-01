"use client";
import { CreditCard, Users, Heart, BookmarkCheck, ShoppingCart, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Connection Status Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your Connections</h2>
                <div className="text-4xl font-bold">15/20</div>
                <p className="text-purple-100">Active connections remaining</p>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-purple-50"
                onClick={() => console.log("Buy more connections")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Buy More Connections
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Visits Card */}
          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Profile Visits
              </CardTitle>
              <CardDescription>Total views on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">247</div>
              <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          {/* Favorites Card */}
          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Your Favorites
              </CardTitle>
              <CardDescription>Profiles you've liked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-600">36</div>
              <p className="text-sm text-muted-foreground mt-1">8 new this week</p>
            </CardContent>
          </Card>

          {/* Shortlisted Card */}
          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-emerald-500" />
                Profile Shortlists
              </CardTitle>
              <CardDescription>Times you've been shortlisted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">18</div>
              <p className="text-sm text-muted-foreground mt-1">+3 new shortlists</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Purchase History
            </CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  item: "Premium Connections Pack",
                  date: "2024-03-15",
                  amount: "$49.99",
                  status: "Completed"
                }
              ].map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-4 rounded-lg bg-white">
                  <div className="space-y-1">
                    <p className="font-medium">{purchase.item}</p>
                    <p className="text-sm text-muted-foreground">{purchase.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{purchase.amount}</span>
                    <span className="text-sm px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {purchase.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}