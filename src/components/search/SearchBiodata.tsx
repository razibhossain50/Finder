"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchCard } from "@/components/search/SearchCard";
import { Pagination } from "@/components/search/Pagination";
import { NoResults } from "@/components/search/NoResults";
import { biodatas } from "@/api/biodatas";

export default function SearchBiodata() {
  // Pagination and results state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(biodatas);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (filters: {
    gender: string;
    maritalStatus: string;
    location: string;
    biodataNumber: string;
  }) => {
    let filteredResults = biodatas;

    if (filters.biodataNumber) {
      filteredResults = filteredResults.filter(biodata =>
        biodata.id.toLowerCase().includes(filters.biodataNumber.toLowerCase())
      );
    }

    if (filters.maritalStatus && filters.maritalStatus !== "all") {
      filteredResults = filteredResults.filter(biodata =>
        biodata.maritalStatus.toLowerCase().replace(" ", "-") === filters.maritalStatus
      );
    }

    if (filters.gender) {
      filteredResults = filteredResults.filter(biodata =>
        biodata.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.location) {
      filteredResults = filteredResults.filter(biodata =>
        biodata.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setSearchResults(filteredResults);
    setCurrentPage(1);
    setHasSearched(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Search Filters */}
        <SearchFilters onSearch={handleSearch} />

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Showing {searchResults.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, searchResults.length)} of {searchResults.length} results
              </p>
            </div>

            {searchResults.length === 0 ? (
              <NoResults />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentResults.map((biodatas) => (
                    <SearchCard key={biodatas.id} biodatas={biodatas} />
                  ))}
                </div>

                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}