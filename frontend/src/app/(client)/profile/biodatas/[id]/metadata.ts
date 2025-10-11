import { Metadata } from 'next';
import { BiodataProfile } from '@/types/biodata';

interface GenerateMetadataProps {
  profile: BiodataProfile;
  biodataId: string;
}

export function generateProfileMetadata({ profile, biodataId }: GenerateMetadataProps): Metadata {
  // Determine gender-specific default image
  const getDefaultImage = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mawami.com';
    
    const isMale = profile.biodataType?.toLowerCase() === 'male' || 
                   profile.biodataType?.toLowerCase() === 'groom';
    const isFemale = profile.biodataType?.toLowerCase() === 'female' || 
                     profile.biodataType?.toLowerCase() === 'bride';
    
    if (profile.profilePicture) {
      // If it's a relative URL, make it absolute
      if (profile.profilePicture.startsWith('/')) {
        return `${baseUrl}${profile.profilePicture}`;
      }
      return profile.profilePicture;
    }
    
    if (isMale) return `${baseUrl}/icons/male.png`;
    if (isFemale) return `${baseUrl}/icons/female.png`;
    return `${baseUrl}/default-profile.svg`; // fallback
  };
  
  const title = `Biodata Profile - BD${biodataId}`;
  const description = `${profile.age} years • ${profile.height} • ${profile.profession} • ${profile.maritalStatus} • ${profile.religion} • ${profile.presentDivision}, ${profile.presentCountry}`;
  const imageUrl = getDefaultImage();
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mawami.com'}/profile/biodatas/${biodataId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      url: currentUrl,
      type: 'profile',
      siteName: 'Mawami - Matrimony Platform',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'profile:first_name': profile.fullName?.split(' ')[0] || '',
      'profile:last_name': profile.fullName?.split(' ').slice(1).join(' ') || '',
      'profile:gender': profile.biodataType || '',
    }
  };
}