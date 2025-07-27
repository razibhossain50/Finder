"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchCard } from "@/components/search/SearchCard";
import { Pagination } from "@/components/search/Pagination";
import { NoResults } from "@/components/search/NoResults";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SearchBiodata() {
  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  // Handle search with database API
  const handleSearch = async (filters: {
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }) => {
    setIsLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.gender && filters.gender !== 'all') {
        queryParams.append('gender', filters.gender);
      }
      
      if (filters.maritalStatus && filters.maritalStatus !== 'all') {
        queryParams.append('maritalStatus', filters.maritalStatus);
      }
      
      if (filters.location) {
        queryParams.append('location', filters.location);
      }
      
      if (filters.biodataNumber) {
        queryParams.append('biodataNumber', filters.biodataNumber);
      }
      
      // Always start from page 1 for new search
      queryParams.append('page', '1');
      queryParams.append('limit', '6');

      const response = await apiRequest("GET", `/api/biodatas/search?${queryParams.toString()}`);
      const result = await response.json();

      setSearchResults(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 0,
      });
      setHasSearched(true);

      toast({
        title: "Search completed",
        description: `Found ${result.pagination?.total || 0} biodata(s)`,
      });
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search biodatas. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
      setPagination({
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      // Get the last search filters (you might want to store these in state)
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '6');

      const response = await apiRequest("GET", `/api/biodatas/search?${queryParams.toString()}`);
      const result = await response.json();

      setSearchResults(result.data || []);
      setPagination(result.pagination || {
        page,
        limit: 6,
        total: 0,
        totalPages: 0,
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Pagination error:', error);
      toast({
        title: "Failed to load page",
        description: error.message || "Failed to load page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Search Filters */}
        <SearchFilters onSearch={handleSearch} />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Searching biodatas...</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && !isLoading && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
            </div>

            {searchResults.length === 0 ? (
              <NoResults />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((biodata) => (
                    <SearchCard key={biodata.id} biodatas={biodata} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}