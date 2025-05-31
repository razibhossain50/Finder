import { Heart, Calendar, User, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Biodata {
  id: string;
  name: string;
  image?: string;
  age: number;
  gender: string;
  profession: string;
  location: string;
  maritalStatus: string;
  height: string;
}

export function SearchCard({ biodatas }: { biodatas: Biodata }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-neutral-200 h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage src={biodatas.image || "/placeholder.svg"} alt={biodatas.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {biodatas.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base text-foreground">{biodatas.name}</h3>
              <Badge variant="outline" className={cn(
                "text-xs",
                biodatas.gender === "male" ? "bg-blue-50 text-blue-600 border-blue-200" : 
                "bg-rose-50 text-rose-600 border-rose-200"
              )}>
                {biodatas.id}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{biodatas.age} years old</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{biodatas.profession}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{biodatas.location}</span>
              </div>
            </div>
            <div className="pt-1.5">
              <Badge variant="secondary" className={cn(
                "text-xs",
                biodatas.maritalStatus.toLowerCase().includes("never") 
                  ? "bg-green-50 text-green-600 border-green-200"
                  : biodatas.maritalStatus.toLowerCase().includes("married")
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
              )}>
                {biodatas.maritalStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-100 mt-auto">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Height:</span> {biodatas.height}
            </div>
            <Button size="sm" variant="outline" className="text-xs font-medium transition-all hover:bg-primary hover:text-primary-foreground">
              <Heart className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}