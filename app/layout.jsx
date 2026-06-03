// UPDATE: replace ninthofaugust.com with your actual domain
const SITE_URL = 'https://9thofaugust.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': SITE_URL,
  name: '9th of August',
  description: 'Professional video production agency and commercial photography studio based in Frisco, Texas. Specializing in brand campaigns, music videos, product photography, and lifestyle content.',
  url: SITE_URL,
  telephone: '+18706361283', // UPDATE: your real phone number (no spaces/dashes)
  email: 'shop@9thofaugust.com', // UPDATE: your real email
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frisco',
    addressRegion: 'TX',
    postalCode: '75034',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.1584,
    longitude: -96.8236,
  },
  priceRange: '$$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography & Videography Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Brand Campaign Photography & Video',
          description: 'Full-scale brand campaign production including commercial photography and videography.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Music Video Production',
          description: 'Professional music video production with creative direction, filming, and post-production editing.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commercial Product Photography',
          description: 'High-resolution product photography for e-commerce, advertising, and marketing materials.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Portrait & Lifestyle Photography',
          description: 'Professional portrait and lifestyle photography sessions for individuals and brands.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Event Coverage',
          description: 'Photo and video documentation of corporate events, product launches, and live events.',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    // Add your social URLs here, e.g.:
    // 'https://www.instagram.com/ninthofaugust',
    // 'https://www.tiktok.com/@ninthofaugust',
  ],
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '9th of August | Video Production & Commercial Photography | Frisco, TX',
    template: '%s | 9th of August',
  },
  description: 'Professional video production agency and commercial photography studio in Frisco, TX. Brand campaigns, music videos, product photography, and lifestyle content. Nationwide coverage.',
  keywords: [
    'video production agency',
    'commercial photography',
    'professional video production',
    'brand campaign photography',
    'music video production',
    'product photography',
    'Frisco TX photographer',
    'Dallas video production',
    'Texas commercial photographer',
    'videography services',
    'content creation agency',
    'brand campaign video',
    'lifestyle photography Dallas',
  ],
  openGraph: {
    title: '9th of August | Video Production & Commercial Photography | Frisco, TX',
    description: 'Professional video production and commercial photography. Brand campaigns, music videos, product shoots. Based in Frisco, TX — nationwide coverage.',
    url: SITE_URL,
    siteName: '9th of August',
    images: [
      {
        url: '/photo1.png',
        width: 1200,
        height: 630,
        alt: '9th of August — Professional Photography & Videography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '9th of August | Video Production & Photography | Frisco TX',
    description: 'Professional video production and commercial photography. Brand campaigns, music videos, product shoots. Frisco, TX — nationwide.',
    images: ['/photo1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
