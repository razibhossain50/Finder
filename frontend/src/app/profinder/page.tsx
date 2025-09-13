"use client";
import { Card, CardBody, Button } from "@heroui/react";
import { PlusCircle, FileText, Camera, Heart, Sparkles, Zap, Users, UserCheck, Award, TrendingUp, Globe } from 'lucide-react';
import Link from 'next/link';

const AllProfessionals = () => {
    const successStory = [
        {
            icon: FileText,
            title: "Share Your Expertise",
            description: "Tell us about your qualifications, experience, and what makes you a trusted professional",
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
            emoji: "📝"
        },
        {
            icon: Camera,
            title: "Build Your Profile",
            description: "Upload professional photos and showcase your credentials and certifications",
            color: "text-green-600",
            bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
            emoji: "📸"
        },
        {
            icon: Heart,
            title: "Connect with Clients",
            description: "Get discovered by people who need your professional services and expertise",
            color: "text-purple-600",
            bgColor: "bg-gradient-to-br from-purple-100 to-violet-100",
            emoji: "💼"
        }
    ];

    const stats = [
        {
            icon: Users,
            number: "8,700+",
            label: "Verified Professionals",
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
            emoji: "👥"
        },
        {
            icon: UserCheck,
            number: "50,000+",
            label: "Active Clients",
            color: "text-green-600",
            bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
            emoji: "✅"
        },
        {
            icon: Heart,
            number: "25,000+",
            label: "Successful Connections",
            color: "text-purple-600",
            bgColor: "bg-gradient-to-br from-purple-100 to-violet-100",
            emoji: "🤝"
        },
        {
            icon: Award,
            number: "4.8/5",
            label: "Average Rating",
            color: "text-orange-600",
            bgColor: "bg-gradient-to-br from-orange-100 to-amber-100",
            emoji: "🏆"
        }
    ];

    const achievements = [
        { icon: TrendingUp, text: "Growing by 500+ professionals monthly" },
        { icon: Globe, text: "Serving clients across 50+ cities" },
        { icon: Heart, text: "New professional connection every hour" }
    ];

    return (
        <div className="-mt-20">
          <div className="mt-80"></div>
            <section className="py-12 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="test">
                    <div className="absolute top-10 left-10 text-6xl">🩺</div>
                    <div className="absolute top-20 right-20 text-4xl">📚</div>
                    <div className="absolute bottom-20 left-1/4 text-5xl">⚙️</div>
                    <div className="absolute bottom-10 right-10 text-3xl">⚖️</div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10 p-4">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6 shadow-sm border border-blue-200">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                        </div>
                        <h2 className="text-title-lg font-bold text-gray-800 mb-4">
                            Your Professional Network Awaits
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join our trusted community of professionals and clients seeking quality services.
                            Creating your professional profile is simple, secure, and completely free.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {successStory.map((item, index) => (
                            <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white/80 backdrop-blur-sm">
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
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>

                        {/* Main CTA Container */}
                        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl p-10 md:p-12 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
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
                                            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                                Ready to Join Our Network?
                                            </span>
                                        </div>
                                    </h3>
                                </div>

                                {/* Right Button Section */}
                                <div className="flex flex-col sm:flex-row gap-4 lg:flex-col xl:flex-row">
                                    {/* Primary CTA Button */}
                                    <Button className="group/btn relative px-10 py-6 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl overflow-hidden" >
                                        <Link href="/profinder/register">
                                            {/* Button Background Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                                            {/* Button Content */}
                                            <div className="relative flex items-center gap-3">
                                                <div className="bg-blue-100 rounded-full p-2 group-hover/btn:bg-blue-200 transition-colors duration-300">
                                                    <PlusCircle className="h-6 w-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                                                </div>
                                                <span>Join as Professional</span>
                                            </div>

                                            {/* Button Shine Effect */}
                                            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-24 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
                {/* Soft Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute bottom-32 right-20">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-200/40 to-indigo-200/40 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-xl"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto relative p-4 z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm border border-blue-200">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-700 font-medium">Our Network</span>
                        </div>
                        <h2 className="text-title-lg font-bold text-gray-800 mb-4">
                            Trusted by Thousands of Professionals
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Every number tells a story of expertise, trust, and successful professional connections
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm group">
                                <CardBody className="p-8 text-center relative overflow-hidden">
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            Why Choose Our Professional Network?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow border border-blue-100">
                                    <div className="flex-none bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
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

export default AllProfessionals;