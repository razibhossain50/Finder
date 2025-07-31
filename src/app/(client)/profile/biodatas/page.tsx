

"use client";
import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, CardHeader, Button, Select, SelectItem, Pagination, Spinner, Avatar, Chip, Divider, Input
} from "@heroui/react";
import { Filter, MapPin, Calendar, User, GraduationCap, Briefcase, Eye } from "lucide-react";
import Link from "next/link";
import { LocationSelector } from "@/components/form/LocationSelector";
import { Search } from "lucide-react";
import { PlusCircle, FileText, Camera, Heart, Sparkles, Zap, Users, UserCheck, Award, TrendingUp, Globe } from 'lucide-react';

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

const AllBiodatas = () => {
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
        } catch (error) {
            console.error('Error fetching biodatas:', error);
            setError(error instanceof Error ? error.message : 'Failed to load biodatas');
        } finally {
            setLoading(false);
        }
    };

    // Handle search functionality
    const handleSearch = () => {
        // Search is handled by the filter state changes automatically
        // This function can be used for additional search logic if needed
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

    const successStory = [
        {
            icon: FileText,
            title: "Share Your Story",
            description: "Tell us about yourself, your values, dreams, and what makes you special",
            color: "text-rose-600",
            bgColor: "bg-gradient-to-br from-rose-100 to-pink-100",
            emoji: "📝"
        },
        {
            icon: Camera,
            title: "Show Your Smile",
            description: "Upload authentic photos that showcase your personality and warmth",
            color: "text-pink-600",
            bgColor: "bg-gradient-to-br from-pink-100 to-purple-100",
            emoji: "📸"
        },
        {
            icon: Heart,
            title: "Find Your Match",
            description: "Share your preferences and vision for your ideal life partner",
            color: "text-purple-600",
            bgColor: "bg-gradient-to-br from-purple-100 to-rose-100",
            emoji: "💖"
        }
    ];

    const stats = [
        {
            icon: Users,
            number: "50,000+",
            label: "Active Members",
            color: "text-rose-600",
            bgColor: "bg-gradient-to-br from-rose-100 to-pink-100",
            emoji: "👥"
        },
        {
            icon: UserCheck,
            number: "25,000+",
            label: "Verified Profiles",
            color: "text-pink-600",
            bgColor: "bg-gradient-to-br from-pink-100 to-purple-100",
            emoji: "✅"
        },
        {
            icon: Heart,
            number: "15,000+",
            label: "Success Stories",
            color: "text-purple-600",
            bgColor: "bg-gradient-to-br from-purple-100 to-rose-100",
            emoji: "💕"
        },
        {
            icon: Award,
            number: "98%",
            label: "Satisfaction Rate",
            color: "text-emerald-600",
            bgColor: "bg-gradient-to-br from-emerald-100 to-green-100",
            emoji: "🏆"
        }
    ];

    const achievements = [
        { icon: TrendingUp, text: "Growing by 1000+ members monthly" },
        { icon: Globe, text: "Connecting hearts across 50+ cities" },
        { icon: Heart, text: "New success story every day" }
    ];

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGender, selectedMaritalStatus, selectedLocation, biodataNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
                <div className="container max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" label="Loading biodatas..." />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
                <div className="container max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <Card className="max-w-md mx-auto">
                            <CardBody className="text-center">
                                <p className="text-danger mb-4">{error}</p>
                                <Button color="primary" onClick={fetchBiodatas}>
                                    Retry
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
            <div className="container max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">All Biodatas</h1>
                    <p className="text-gray-600 text-lg">
                        Discover and connect with verified profiles
                    </p>
                    <Chip color="primary" variant="flat" size="lg">
                        {filteredBiodatas.length} Profile{filteredBiodatas.length !== 1 ? 's' : ''} Found
                    </Chip>
                </div>

                {/* Search and Filters */}
                <Card className="w-full shadow-md">
                    <CardHeader className="bg-neutral-50 rounded-t-lg text-center pb-2">
                        <h2 className="text-2xl font-bold">Find Your Perfect Match</h2>
                        <p className="text-default-500">Use our advanced filters to discover compatible life partners</p>
                    </CardHeader>
                    <CardBody className="p-6">
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">I&apos;m looking for</label>
                                <Select
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
                                    placeholder="Enter biodata number"
                                    value={biodataNumber}
                                    onChange={(e) => setBiodataNumber(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            color="primary"
                            size="lg"
                            onClick={handleSearch}
                            startContent={<Search className="h-4 w-4" />}
                        >
                            Search Biodata
                        </Button>
                    </CardBody>
                </Card>

                {/* Biodatas Grid */}
                {currentBiodatas.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentBiodatas.map((biodata) => (
                            <Card key={biodata.id} className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Chip
                                            color={biodata.biodataType?.toLowerCase() === "male" ? "primary" : "secondary"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            ID: BD{biodata.id}
                                        </Chip>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onClick={() => toggleFavorite(biodata.id)}
                                            className={favorites.has(biodata.id) ? "text-red-500" : "text-gray-400"}
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${favorites.has(biodata.id) ? "fill-current" : ""}`}
                                            />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardBody className="space-y-4">
                                    {/* Profile Avatar */}
                                    <div className="flex justify-center">
                                        <Avatar
                                            src={biodata.profilePicture}
                                            name={biodata.fullName}
                                            size="lg"
                                            className="w-20 h-20"
                                        />
                                    </div>

                                    {/* Profile Info */}
                                    <div className="text-center space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {biodata.fullName || "Unknown User"}
                                        </h3>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center justify-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{biodata.age || "N/A"} years old</span>
                                            </div>

                                            <div className="flex items-center justify-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span className="truncate">
                                                    {biodata.presentDivision || "Unknown"}, {biodata.presentCountry || "Unknown"}
                                                </span>
                                            </div>

                                            {biodata.profession && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Briefcase className="h-3.5 w-3.5" />
                                                    <span className="truncate">{biodata.profession}</span>
                                                </div>
                                            )}

                                            {biodata.highestEducation && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <GraduationCap className="h-3.5 w-3.5" />
                                                    <span className="truncate">{biodata.highestEducation}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex justify-center gap-1 flex-wrap">
                                            <Chip size="sm" variant="flat" color="primary">
                                                {biodata.biodataType || "Unknown"}
                                            </Chip>
                                            <Chip size="sm" variant="flat" color="secondary">
                                                {biodata.maritalStatus || "Unknown"}
                                            </Chip>
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* View Profile Button */}
                                    <Button
                                        as={Link}
                                        href={`/profile/biodatas/${biodata.id}`}
                                        color="primary"
                                        variant="solid"
                                        className="w-full"
                                        startContent={<Eye className="h-4 w-4" />}
                                    >
                                        View Full Biodata
                                    </Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardBody className="text-center py-12">
                            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profiles Found</h3>
                            <p className="text-gray-600 mb-4">
                                {selectedGender !== "" || selectedMaritalStatus !== "" || selectedLocation !== "" || biodataNumber !== ""
                                    ? "No profiles match your current filters. Try adjusting your search criteria."
                                    : "No profiles are available at the moment. Check back later!"
                                }
                            </p>
                            {(selectedGender !== "" || selectedMaritalStatus !== "" || selectedLocation !== "" || biodataNumber !== "") && (
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onClick={() => {
                                        setSelectedGender("");
                                        setSelectedMaritalStatus("");
                                        setSelectedLocation("");
                                        setBiodataNumber("");
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            )}
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
            <section className="py-24 px-4 bg-gradient-to-br from-white via-rose-50/50 to-pink-50/50 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-6xl">💕</div>
                    <div className="absolute top-20 right-20 text-4xl">✨</div>
                    <div className="absolute bottom-20 left-1/4 text-5xl">💑</div>
                    <div className="absolute bottom-10 right-10 text-3xl">🌟</div>
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 rounded-full mb-6 shadow-sm border border-rose-200">
                            <Sparkles className="h-4 w-4 text-rose-500" />
                            <span className="text-rose-700 font-medium">Create Your Profile</span>
                        </div>
                        <h2 className="text-title-lg font-bold text-gray-800 mb-4">
                            Your Perfect Match Awaits
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join our trusted community of hearts seeking meaningful connections.
                            Creating your matrimony profile is simple, secure, and completely free.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {successStory.map((item, index) => (
                            <Card key={index} className="border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white/80 backdrop-blur-sm">
                                <CardBody className="p-8 text-center relative">
                                    <div className={`${item.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform shadow-md`}>
                                        <item.icon className={`h-8 w-8 ${item.color}`} />
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Beautiful Call-to-Action Section */}
                    <div className="relative group">
                        {/* Glowing Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>

                        {/* Main CTA Container */}
                        <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-10 md:p-12 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-6 left-6">
                                    <Heart className="h-12 w-12 fill-current animate-pulse" />
                                </div>
                                <div className="absolute top-8 right-8">
                                    <Sparkles className="h-10 w-10 animate-pulse delay-1000" />
                                </div>
                                <div className="absolute bottom-6 left-1/3">
                                    <Users className="h-8 w-8 animate-pulse delay-2000" />
                                </div>
                                <div className="absolute bottom-8 right-6">
                                    <Award className="h-10 w-10 animate-pulse delay-500" />
                                </div>
                            </div>

                            {/* Floating Particles Effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
                                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-700"></div>
                                <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-1000"></div>
                            </div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                                {/* Left Content Section */}
                                <div className="text-center lg:text-left flex-1">
                                    {/* Main Heading */}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                                <Zap className="h-8 w-8 animate-pulse text-yellow-300" />
                                            </div>
                                            <span className="bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent">
                                                Ready to Find Your Soulmate?
                                            </span>
                                        </div>
                                    </h3>
                                </div>

                                {/* Right Button Section */}
                                <div className="flex flex-col sm:flex-row gap-4 lg:flex-col xl:flex-row">
                                    {/* Primary CTA Button */}
                                    <Button className="group/btn relative px-10 py-6 bg-white text-rose-600 hover:bg-rose-50 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl overflow-hidden">
                                        {/* Button Background Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                                        {/* Button Content */}
                                        <div className="relative flex items-center gap-3">
                                            <div className="bg-rose-100 rounded-full p-2 group-hover/btn:bg-rose-200 transition-colors duration-300">
                                                <PlusCircle className="h-6 w-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                                            </div>
                                            <span>Create Your Profile</span>
                                        </div>

                                        {/* Button Shine Effect */}
                                        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                    </Button>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
                {/* Soft Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute bottom-32 right-20">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-200/40 to-rose-200/40 rounded-full blur-xl"></div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm border border-rose-200">
                            <TrendingUp className="h-4 w-4 text-rose-500" />
                            <span className="text-rose-700 font-medium">Our Success</span>
                        </div>
                        <h2 className="text-title-lg font-bold text-gray-800 mb-4">
                            Trusted by Thousands of Hearts
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Every number tells a story of love, connection, and dreams fulfilled
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm group">
                                <CardBody className="p-8 text-center relative overflow-hidden">
                                    <div className="absolute -top-2 -right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
                                        {stat.emoji}
                                    </div>

                                    <div className={`${stat.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>

                                    <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-105 transition-transform`}>
                                        {stat.number}
                                    </div>

                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100">
                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            Why Choose Our Matrimony Platform?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow border border-rose-100">
                                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                                        <achievement.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{achievement.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AllBiodatas;