// SEO Component for Meta Tags
// Manages page-specific SEO metadata

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
}

export default function SEO({
  title = 'Yatra Rentals Nepal - Vehicle Rental Platform',
  description = 'Rent cars, bikes, and SUVs in Nepal. Best vehicle rental service in Kathmandu, Pokhara, and across Nepal. Affordable rates, verified vehicles, and excellent service.',
  keywords = 'vehicle rental nepal, car rental kathmandu, bike rental pokhara, SUV rental nepal, rent a car nepal',
  image = '/images/og-image.jpg',
  url = 'https://yatrarentals.com',
  type = 'website',
  author = 'Yatra Rentals Nepal',
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags (Facebook, LinkedIn)
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'Yatra Rentals Nepal', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow', 'name');
    updateMetaTag('language', 'English', 'name');
    updateMetaTag('revisit-after', '7 days', 'name');
  }, [title, description, keywords, image, url, type, author]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

// Structured Data (JSON-LD) Component
export function StructuredData({ data }: { data: object }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';

    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.replaceWith(script);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

// Common structured data schemas
export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Yatra Rentals Nepal',
    url: 'https://yatrarentals.com',
    logo: 'https://yatrarentals.com/logo.png',
    description: 'Vehicle rental service in Nepal',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NP',
      addressLocality: 'Kathmandu',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-1-1234567',
      contactType: 'Customer Service',
    },
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yatra Rentals Nepal',
    url: 'https://yatrarentals.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yatrarentals.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },

  product: (vehicle: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.description,
    image: vehicle.images,
    offers: {
      '@type': 'Offer',
      price: vehicle.pricePerDay,
      priceCurrency: 'NPR',
      availability: vehicle.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: vehicle.rating && {
      '@type': 'AggregateRating',
      ratingValue: vehicle.rating,
      reviewCount: vehicle.reviewCount || 0,
    },
  }),
};
