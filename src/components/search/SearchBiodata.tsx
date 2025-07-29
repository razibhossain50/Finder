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
    limit: 8,
    total: 0,
    totalPages: 0,
  });
  
  // Store all results for client-side pagination
  const [allResults, setAllResults] = useState<any[]>([]);
  const { toast } = useToast();

  // Store current filters for pagination
  const [currentFilters, setCurrentFilters] = useState<{
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }>({
    gender: '',
    maritalStatus: '',
    location: '',
    biodataNumber: ''
  });

  // Client-side filtering function
  const filterBiodatas = (biodatas: any[], filters: {
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }) => {
    return biodatas.filter((biodata) => {
      // Gender filter - using biodataType field which contains "Male" or "Female"
      if (filters.gender && filters.gender !== 'all' && filters.gender !== '') {
        if (biodata.biodataType !== filters.gender) {
          return false;
        }
      }
      
      // Marital status filter
      if (filters.maritalStatus && filters.maritalStatus !== 'all' && filters.maritalStatus !== '') {
        if (biodata.maritalStatus !== filters.maritalStatus) {
          return false;
        }
      }
      
      // Location filter (check multiple address fields)
      if (filters.location && filters.location !== '') {
        const locationMatch = 
          biodata.presentArea?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.permanentArea?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.presentZilla?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.permanentZilla?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.presentUpazilla?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.permanentUpazilla?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.presentDivision?.toLowerCase().includes(filters.location.toLowerCase()) ||
          biodata.permanentDivision?.toLowerCase().includes(filters.location.toLowerCase());
        
        if (!locationMatch) {
          return false;
        }
      }
      
      // Biodata number filter - using id field
      if (filters.biodataNumber && filters.biodataNumber !== '') {
        if (!biodata.id?.toString().includes(filters.biodataNumber)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Handle search with database API
  const handleSearch = async (filters: {
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }) => {
    setIsLoading(true);
    setCurrentFilters(filters); // Store filters for pagination
    
    try {
      // Get all biodatas from API
      const response = await apiRequest("GET", "/api/biodatas");
      const result = await response.json();

      // Extract biodatas array
      const allBiodatas = Array.isArray(result) ? result : (result.data || []);
      
      // Apply client-side filtering
      const filteredResults = filterBiodatas(allBiodatas, filters);
      
      // Store all filtered results for pagination
      setAllResults(filteredResults);
      
      // Calculate pagination
      const totalPages = Math.ceil(filteredResults.length / 8);
      const currentPageResults = filteredResults.slice(0, 8); // First 8 results
      
      setSearchResults(currentPageResults);
      setPagination({
        page: 1,
        limit: 8,
        total: filteredResults.length,
        totalPages: totalPages,
      });
      
      setHasSearched(true);

      toast({
        title: "Search completed",
        description: `Found ${filteredResults.length} biodata(s)`,
      });
    } catch (error: unknown) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search biodatas. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
      setAllResults([]);
      setPagination({
        page: 1,
        limit: 8,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    
    try {
      // Calculate the start and end indices for the requested page
      const startIndex = (page - 1) * 8;
      const endIndex = startIndex + 8;
      
      // Get the results for the current page from allResults
      const currentPageResults = allResults.slice(startIndex, endIndex);
      
      // Update the search results and pagination state
      setSearchResults(currentPageResults);
      setPagination(prev => ({
        ...prev,
        page: page
      }));

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: unknown) {
      console.error('Pagination error:', error);
      toast({
        title: "Failed to load page",
        description: "Failed to load page. Please try again.",
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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