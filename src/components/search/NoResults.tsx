import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function NoResults() {
  return (
    <Card className="p-8 text-center bg-white/90 border-neutral-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No matches found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your search criteria to find more potential matches.
            You can broaden your search by selecting fewer filters.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}