import { Layout, Menu, X, User, ChevronDown, LogIn, UserPlus, Settings, LogOut, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
const Footer = () => {
  return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layout className="h-6 w-6 text-indigo-600" />
                <span className="font-bold text-lg">Brand</span>
              </div>
              <p className="text-gray-500 text-sm">
                Making the world a better place through constructing elegant hierarchies.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Solutions</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Marketing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Analytics</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Commerce</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Insights</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Documentation</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">Guides</a></li>
                <li><a href="#" className="text-gray-500 hover:text-indigo-600">API Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
              <p className="text-gray-500 text-sm mb-4">Subscribe to our newsletter for updates</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm">
                © 2024 Brand, Inc. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer