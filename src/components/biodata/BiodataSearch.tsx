"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Input, Chip,
        Pagination, Avatar, Divider} from "@heroui/react";
import { Search, User, Eye, Heart, Sparkles, Star } from "lucide-react";
import { LocationSelector } from "@/components/form/LocationSelector";

interface Biodata {
    id: number;
    fullName: string;
    profilePicture?: string;
    age: number;
    biodataType: string;
    profession: string;
    presentCountry?: string;
    presentDivision?: string;
    presentZilla?: string;
    presentArea?: string;
    permanentArea?: string;
    permanentZilla?: string;
    presentUpazilla?: string;
    permanentUpazilla?: string;
    permanentDivision?: string;
    maritalStatus: string;
    height: string;
    complexion?: string;
    religion?: string;
    educationMedium?: string;
    highestEducation?: string;
}

export const BiodataSearch = () => {
    const [biodatas, setBiodatas] = useState<Biodata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [biodataNumber, setBiodataNumber] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const itemsPerPage = 12;

    // Fetch biodatas from API
    useEffect(() => {
        fetchBiodatas();
    }, []);

    const fetchBiodatas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas`);

            if (!response.ok) {
                throw new Error('Failed to fetch biodatas');
            }

            const data = await response.json();
            // Handle both single object and array responses
            const biodatasArray = Array.isArray(data) ? data : [data];
            setBiodatas(biodatasArray);
            setError(null);
        } catch (error) {
            console.error('Error fetching biodatas:', error);
            setError(error instanceof Error ? error.message : 'Failed to load biodatas');
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    const filteredBiodatas = useMemo(() => {
        return biodatas.filter(biodata => {
            // Gender filter
            const matchesGender = !selectedGender || selectedGender === "" || selectedGender === "all" ||
                biodata.biodataType?.toLowerCase() === selectedGender.toLowerCase();

            // Marital status filter
            const matchesMaritalStatus = !selectedMaritalStatus || selectedMaritalStatus === "" || selectedMaritalStatus === "all" ||
                biodata.maritalStatus?.toLowerCase() === selectedMaritalStatus.toLowerCase();

            // Location filter (check multiple address fields)
            const matchesLocation = !selectedLocation || selectedLocation === '' ||
                biodata.presentArea?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.permanentArea?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.presentZilla?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.permanentZilla?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.presentUpazilla?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.permanentUpazilla?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.presentDivision?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                biodata.permanentDivision?.toLowerCase().includes(selectedLocation.toLowerCase());

            // Biodata number filter
            const matchesBiodataNumber = !biodataNumber || biodataNumber === '' ||
                biodata.id.toString().includes(biodataNumber);

            return matchesGender && matchesMaritalStatus && matchesLocation && matchesBiodataNumber;
        });
    }, [biodatas, selectedGender, selectedMaritalStatus, selectedLocation, biodataNumber]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBiodatas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBiodatas = filteredBiodatas.slice(startIndex, endIndex);

    // Handle favorite toggle
    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(id)) {
                newFavorites.delete(id);
            } else {
                newFavorites.add(id);
            }
            return newFavorites;
        });
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredBiodatas]);

    const handleSearch = () => {
        // Trigger re-filtering by updating state (already handled by useMemo)
        // This function can be used for additional search logic if needed
    };


    if (loading) {
        return (
            <div className="space-y-8">
                {/* Enhanced Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                        All Biodatas
                    </h1>
                    <p className="text-gray-600 text-lg">Discover and connect with verified profiles</p>
                </div>
                
                {/* Beautiful Loading State */}
                <div className="text-center py-20">
                    <div className="relative">
                        {/* Animated loading spinner */}
                        <div className="w-16 h-16 mx-auto mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-rose-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                        </div>
                        
                        {/* Loading text with sparkle effect */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" />
                            <h2 className="text-xl font-semibold text-gray-800">Loading Profiles</h2>
                            <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" />
                        </div>
                        
                        <p className="text-gray-600 animate-pulse">Finding perfect matches for you...</p>
                        
                        {/* Skeleton cards preview */}
                        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 animate-pulse border border-rose-100">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                        All Biodatas
                    </h1>
                    <p className="text-gray-600 text-lg">Discover and connect with verified profiles</p>
                </div>
                <div className="text-center py-20">
                    <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardBody className="text-center p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-600 mb-6">{error}</p>
                            <Button 
                                color="primary" 
                                onPress={() => window.location.reload()}
                                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                            >
                                Try Again
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-5 py-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                        <div className="flex items-center justify-center gap-2">
                                <Sparkles className="h-6 w-6 text-rose-500" />
                                <div className=" text-gray-800">Finder</div>
                                <Sparkles className="h-6 w-6 text-rose-500" />
                        </div>
                </h1>
                <p className="text-gray-600 text-2xl">&quot;Craft your love story with someone who complements your soul and spirit&quot;</p>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="overflow-visible w-full bg-white/80  border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardBody className="p-8 overflow-y-visible">
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">I&apos;m looking for</label>
                            <Select
                                size="lg"
                                placeholder="Select gender"
                                selectedKeys={selectedGender ? [selectedGender] : []}
                                onSelectionChange={(keys) => setSelectedGender(Array.from(keys)[0] as string)}
                                className="w-full"
                            >
                                <SelectItem key="Male">Male</SelectItem>
                                <SelectItem key="Female">Female</SelectItem>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Marital status</label>
                            <Select
                                size="lg"
                                placeholder="Select marital status"
                                selectedKeys={selectedMaritalStatus ? [selectedMaritalStatus] : []}
                                onSelectionChange={(keys) => setSelectedMaritalStatus(Array.from(keys)[0] as string)}
                                className="w-full"
                            >
                                <SelectItem key="all">All</SelectItem>
                                <SelectItem key="Unmarried">Unmarried</SelectItem>
                                <SelectItem key="Married">Married</SelectItem>
                                <SelectItem key="Divorced">Divorced</SelectItem>
                                <SelectItem key="Widow">Widow</SelectItem>
                                <SelectItem key="Widower">Widower</SelectItem>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Location</label>
                            <LocationSelector onLocationSelect={setSelectedLocation} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Biodata Number</label>
                            <Input
                                size="lg"
                                placeholder="Enter biodata number"
                                value={biodataNumber}
                                onChange={(e) => setBiodataNumber(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        size="lg"
                        onPress={handleSearch}
                        startContent={<Search className="h-5 w-5" />}
                        isLoading={loading}
                    >
                        Find Your Partner
                    </Button>
                </CardBody>
            </Card>

            {/* Enhanced Biodatas Grid */}
            {currentBiodatas.length > 0 ? (
                <div className="grid gap-4 md:gap-8 md:grid-cols-3">
                    {currentBiodatas.map((biodata) => (
                        <Card key={biodata.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                            {/* Card Header with Gradient */}
                            <CardHeader className="bg-gradient-to-r from-rose-400 to-pink-500 text-white pb-2 relative">
                                <div className="absolute top-2 right-2 opacity-20">
                                    <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
                                </div>
                                <div className="flex justify-between items-start w-full">
                                    <Chip
                                        color={biodata.biodataType?.toLowerCase() === "male" ? "primary" : "secondary"}
                                        variant="flat"
                                        size="sm"
                                        className="bg-white/90 backdrop-blur-sm"
                                        startContent={<Star className="h-3 w-3" />}
                                    >
                                        BD{biodata.id}
                                    </Chip>
                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        size="sm"
                                        onPress={() => toggleFavorite(biodata.id)}
                                        className={`${favorites.has(biodata.id) ? "bg-white/90" : "bg-white/90 text-gray-400 hover:text-red-500"} transition-all duration-200`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${favorites.has(biodata.id) ? "fill-rose-500 stroke-rose-500" : ""} group-hover:scale-110 transition-transform`}
                                        />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardBody className="space-y-3 md:space-y-6 p-3 md:p-4">
                                {/* Enhanced Profile Avatar */}
                                <div className="grid grid-cols-24">
                                    <div className="col-span-6 flex justify-center">
                                        <div className="relative">
                                            {
                                                biodata.biodataType=="Male"?(
                                                    <Avatar
                                                src={biodata.profilePicture?`${biodata.profilePicture}`:"icons/male.png"}
                                                name={biodata.fullName}
                                                size="lg"
                                                className="w-fit h-fit border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                            />

                                                ):(
                                                    <Avatar
                                                src={biodata.profilePicture?`${biodata.profilePicture}`:"icons/female.png"}
                                                name={biodata.fullName}
                                                size="lg"
                                                className="w-24 h-24 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                            />
                                                )
                                            }
                                        </div>
                                    </div>

                                    {/* Enhanced Profile Info */}
                                    <div className="col-span-18 space-y-1 px-3">
                                        <div className=" text-lg text-gray-900 group-hover:text-rose-600 transition-colors duration-200">
                                            <span className="font-bold">Age: </span>{biodata.age || "Unknown User"}
                                        </div>
                                        <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                <span className="truncate font-medium">
                                                <span className="font-bold">Height: </span>{biodata.height || "Unknown"}
                                                </span>
                                            </div>
                                        {
                                            biodata.biodataType=="male"?(
                                            <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                <span className="truncate font-medium">
                                                <span className="font-bold">Complexion: </span>{biodata.complexion || "Unknown"}
                                                </span>
                                            </div>

                                            ):(
                                            <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                <span className="font-bold">Profession: </span><span className="truncate font-medium">{biodata.profession}</span>
                                            </div>

                                            )
                                        }
                                    </div>

                                </div>

                                <Divider className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Enhanced View Profile Button */}
                                <Button
                                    as={Link}
                                    href={`/profile/biodatas/${biodata.id}`}
                                    className="w-full bg-white border-1 text-rose-500 border-rose-500 hover:from-rose-600 hover:to-pink-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    size="md"
                                    startContent={<Eye className="h-4 w-4" />}
                                >
                                    View Full Profile
                                </Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardBody className="text-center py-16">
                        <div className="relative">
                            {/* Decorative background */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-4 left-4 text-4xl">💕</div>
                                <div className="absolute top-8 right-8 text-3xl">✨</div>
                                <div className="absolute bottom-4 left-8 text-3xl">💑</div>
                                <div className="absolute bottom-8 right-4 text-4xl">🌟</div>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <User className="h-12 w-12 text-rose-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Perfect Matches Found</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                    Don&apos;t worry! Your soulmate might be just around the corner. Try adjusting your search filters or check back later for new profiles.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                    <Button
                                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                        onPress={() => {
                                            setSelectedGender("");
                                            setSelectedMaritalStatus("");
                                            setSelectedLocation("");
                                            setBiodataNumber("");
                                        }}
                                        startContent={<Search className="h-4 w-4" />}
                                    >
                                        Clear All Filters
                                    </Button>
                                    <Button
                                        variant="flat"
                                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200"
                                        onPress={fetchBiodatas}
                                        startContent={<Sparkles className="h-4 w-4" />}
                                    >
                                        Refresh Profiles
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        showControls
                        showShadow
                        color="primary"
                    />
                </div>
            )}

            {/* Results Summary */}
            {filteredBiodatas.length > 0 && (
                <div className="text-center text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredBiodatas.length)} of {filteredBiodatas.length} profiles
                </div>
            )}
        </div>
    );
};