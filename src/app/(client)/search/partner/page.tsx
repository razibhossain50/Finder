
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBiodata from '@/components/search/SearchBiodata'
import { PlusCircle, FileText, Camera, Heart, Sparkles, Zap, Users, UserCheck, Award, TrendingUp, Globe } from 'lucide-react';


const SearchBiodataPage = () => {


  const steps = [
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
  return (
    <div>
      <SearchBiodata />
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
            {steps.map((step, index) => (
              <Card key={index} className="border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white border-4 border-rose-100 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl">{step.emoji}</span>
                    </div>
                  </div>

                  <div className={`${step.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform shadow-md`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  Ready to Find Your Soulmate?
                </h3>
                <p className="text-rose-100">
                  Join 50,000+ happy couples who found their perfect match with us
                </p>
              </div>
              <Button className="px-8 py-4 bg-white text-rose-600 hover:bg-rose-50 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your Profile Now
              </Button>
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
                <CardContent className="p-8 text-center relative overflow-hidden">
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
                </CardContent>
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
  )
}

export default SearchBiodataPage