'use client';
import { useState } from 'react';
import { Button, Chip, Avatar, Progress, Divider } from "@heroui/react";
import { Eye, MessageCircle, Calendar, Star, TrendingUp, Users, Phone, Mail, Edit, Settings } from "lucide-react";

const MOCK_PROFESSIONAL_DATA = {
  name: 'Dr. Sarah Ahmed',
  category: 'doctor',
  specialization: 'Cardiologist',
  profilePicture: null,
  verified: true,
  rating: 4.8,
  totalReviews: 156,
  profileViews: 1247,
  messagesReceived: 23,
  appointmentsBooked: 45,
  profileCompleteness: 85,
  joinDate: '2023-06-15',
  status: 'active'
};

const MOCK_RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Mohammad Rahman',
    time: '2 hours ago',
    icon: MessageCircle
  },
  {
    id: 2,
    type: 'appointment',
    title: 'Appointment booked by Fatima Khan',
    time: '5 hours ago',
    icon: Calendar
  },
  {
    id: 3,
    type: 'review',
    title: 'New 5-star review received',
    time: '1 day ago',
    icon: Star
  },
  {
    id: 4,
    type: 'profile_view',
    title: 'Profile viewed 15 times today',
    time: '1 day ago',
    icon: Eye
  }
];

const MOCK_STATS = [
  {
    title: 'Profile Views',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Eye,
    color: 'text-blue-600'
  },
  {
    title: 'Messages',
    value: '23',
    change: '+5',
    trend: 'up',
    icon: MessageCircle,
    color: 'text-green-600'
  },
  {
    title: 'Appointments',
    value: '45',
    change: '+8',
    trend: 'up',
    icon: Calendar,
    color: 'text-purple-600'
  },
  {
    title: 'Rating',
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: Star,
    color: 'text-yellow-600'
  }
];

export default function ProfessionalDashboard() {
  const [professional] = useState(MOCK_PROFESSIONAL_DATA);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Professional Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your professional profile and track your performance
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="bordered"
                startContent={<Edit className="w-4 h-4" />}
              >
                Edit Profile
              </Button>
              <Button
                variant="bordered"
                startContent={<Settings className="w-4 h-4" />}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_STATS.map((stat, index) => (
                <div key={index} className="professional-card">
                  <div className="professional-card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Completeness */}
            <div className="professional-card">
              <div className="professional-card-header">
                <h3 className="text-lg font-semibold">Profile Completeness</h3>
              </div>
              <div className="professional-card-body">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium">{professional.profileCompleteness}%</span>
                  </div>
                  <Progress 
                    value={professional.profileCompleteness} 
                    color="success"
                    className="w-full"
                  />
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Basic Information</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Professional Details</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Profile Picture</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Certifications</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Working Hours</span>
                        <span className="text-yellow-600">⚠ Incomplete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Services List</span>
                        <span className="text-yellow-600">⚠ Incomplete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="professional-card">
              <div className="professional-card-header">
                <h3 className="text-lg font-semibold">Recent Activities</h3>
              </div>
              <div className="professional-card-body">
                <div className="space-y-4">
                  {MOCK_RECENT_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <activity.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="professional-card">
              <div className="professional-card-body text-center">
                <Avatar
                  src={professional.profilePicture || undefined}
                  name={professional.name}
                  className="w-20 h-20 text-large mx-auto mb-4"
                />
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {professional.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  {professional.specialization}
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Chip
                    color={getStatusColor(professional.status)}
                    size="sm"
                    variant="flat"
                  >
                    {professional.status.charAt(0).toUpperCase() + professional.status.slice(1)}
                  </Chip>
                  {professional.verified && (
                    <Chip color="primary" size="sm" variant="flat">
                      Verified
                    </Chip>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{professional.rating}</span>
                  <span className="text-sm text-gray-500">({professional.totalReviews} reviews)</span>
                </div>
                
                <Divider className="my-4" />
                
                <div className="text-left space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">
                      {new Date(professional.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile views:</span>
                    <span className="font-medium">{professional.profileViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="professional-card">
              <div className="professional-card-header">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="professional-card-body space-y-3">
                <Button
                  variant="bordered"
                  className="w-full justify-start"
                  startContent={<MessageCircle className="w-4 h-4" />}
                >
                  View Messages ({professional.messagesReceived})
                </Button>
                
                <Button
                  variant="bordered"
                  className="w-full justify-start"
                  startContent={<Calendar className="w-4 h-4" />}
                >
                  Manage Appointments
                </Button>
                
                <Button
                  variant="bordered"
                  className="w-full justify-start"
                  startContent={<Star className="w-4 h-4" />}
                >
                  View Reviews
                </Button>
                
                <Button
                  variant="bordered"
                  className="w-full justify-start"
                  startContent={<Eye className="w-4 h-4" />}
                >
                  View Public Profile
                </Button>
              </div>
            </div>

            {/* Performance Tips */}
            <div className="professional-card">
              <div className="professional-card-header">
                <h3 className="text-lg font-semibold">Performance Tips</h3>
              </div>
              <div className="professional-card-body">
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900 mb-1">Complete your profile</p>
                    <p className="text-blue-700">Add working hours and services to get 15% more visibility</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900 mb-1">Respond quickly</p>
                    <p className="text-green-700">Reply to messages within 2 hours to improve your rating</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900 mb-1">Encourage reviews</p>
                    <p className="text-purple-700">Ask satisfied clients to leave reviews to build trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}