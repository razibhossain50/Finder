import Link from "next/link";

type ServiceType = 'mawami' | 'profinder';

interface FooterProps {
  type?: ServiceType;
}

const SERVICE_CONFIG = {
  mawami: {
    name: 'Mawami',
    basePath: '',
    links: {
      privacy: '/privacy-policy',
      terms: '/terms-of-service',
      cookies: '/cookie-policy'
    }
  },
  profinder: {
    name: 'Professional Services',
    basePath: '/profinder',
    links: {
      privacy: '/profinder/privacy-policy',
      terms: '/profinder/terms-of-service',
      cookies: '/profinder/cookie-policy'
    }
  }
};

const Footer = ({ type = 'mawami' }: FooterProps) => {
  const config = SERVICE_CONFIG[type];
  
  return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm">
                © 2025 {config.name}, All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href={config.links.privacy} className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</Link>
                <Link href={config.links.terms} className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</Link>
                <Link href={config.links.cookies} className="text-gray-500 hover:text-indigo-600 text-sm">Cookie Policy</Link>
              </div>
            </div>
        </div>
      </footer>
  )
}

export default Footer