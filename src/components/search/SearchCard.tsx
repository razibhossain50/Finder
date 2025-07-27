import { Heart, Calendar, User, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Biodata {
  id: number;
  fullName: string;
  profilePicture?: string;
  age: number;
  biodataType: string; // Male/Female
  profession: string;
  presentCountry?: string;
  presentDivision?: string;
  presentZilla?: string;
  permanentCountry?: string;
  permanentDivision?: string;
  permanentZilla?: string;
  maritalStatus: string;
  height: string;
  complexion?: string; // Complexion
  religion?: string;
  educationMedium?: string;
  highestEducation?: string;
}

export function SearchCard({ biodatas }: { biodatas: Biodata }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add API call to save/remove favorite
  };

  const handleViewBiodata = () => {
    // TODO: Navigate to full biodata page
    console.log('View biodata:', biodatas.id);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-neutral-200 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header with ID and Favorite Button */}
        <div className="flex items-center justify-between p-4 pb-2">
          <Badge variant="outline" className={cn(
            "text-xs font-semibold",
            biodatas.biodataType?.toLowerCase() === "male" ? "bg-blue-50 text-blue-600 border-blue-200" : 
            "bg-rose-50 text-rose-600 border-rose-200"
          )}>
            ID: BD{biodatas.id}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFavoriteClick}
            className={cn(
              "h-8 w-8 p-0 transition-all duration-200",
              isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
            )}
          >
            <Heart 
              className={cn("h-4 w-4", isFavorite && "fill-current")} 
              strokeWidth={2}
            />
          </Button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center px-4 pb-3">
          <Avatar className="h-20 w-20 border-3 border-white shadow-md">
            <AvatarImage 
              src={biodatas.profilePicture || "/placeholder.svg"} 
              alt={biodatas.fullName || 'User'} 
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-lg font-semibold">
              {biodatas.fullName ? biodatas.fullName.split(' ').map(n => n[0]).join('') : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Details */}
        <div className="px-4 pb-4 flex-1 space-y-3">
          {/* Name */}
          <div className="text-center">
            <h3 className="font-semibold text-lg text-foreground truncate">
              {biodatas.fullName || 'Name not provided'}
            </h3>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{biodatas.age}</span> years
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-muted-foreground truncate">
                <span className="font-medium text-foreground">{biodatas.height || 'N/A'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <div className="h-3.5 w-3.5 bg-orange-400 rounded-full flex-shrink-0"></div>
              <span className="text-muted-foreground truncate">
                <span className="font-medium text-foreground">{biodatas.complexion || 'Not specified'}</span> complexion
              </span>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <User className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-muted-foreground truncate">
                <span className="font-medium text-foreground">{biodatas.profession || 'Not specified'}</span>
              </span>
            </div>
          </div>

          {/* Marital Status Badge */}
          <div className="flex justify-center pt-2">
            <Badge variant="secondary" className={cn(
              "text-xs",
              biodatas.maritalStatus?.toLowerCase().includes("unmarried") 
                ? "bg-green-50 text-green-600 border-green-200"
                : biodatas.maritalStatus?.toLowerCase().includes("married")
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            )}>
              {biodatas.maritalStatus || 'Status not specified'}
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 pt-0 mt-auto">
          <Button 
            onClick={handleViewBiodata}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
            size="sm"
          >
            View Full Biodata
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}