import { useEffect } from 'react';

const PAGE_SEO_METADATA = {
  home: {
    title: 'DriveIT | Fast. Easy. Everyday — India’s Intercity Expressway Carpool',
    description: 'Save up to 70% on intercity travel with verified pilots. Instant booking and live GPS tracking across Mumbai-Pune, Bangalore-Chennai, Delhi-Jaipur.'
  },
  'available-rides': {
    title: 'Explore Verified Highway Pilots & Rides | DriveIT',
    description: 'Browse live carpools on Mumbai-Pune, Bangalore-Chennai, and Delhi-Jaipur expressways. View pilot trust ratings, EV discounts, and FASTag toll splits.'
  },
  'explore-pilots': {
    title: 'Explore Verified Highway Pilots & Rides | DriveIT',
    description: 'Browse live carpools on Mumbai-Pune, Bangalore-Chennai, and Delhi-Jaipur expressways. View pilot trust ratings, EV discounts, and FASTag toll splits.'
  },
  'lister-hub': {
    title: 'Pilot Flight Deck — Publish & Manage Highway Departures | DriveIT',
    description: 'List empty car seats, offset fuel and FASTag tolls, and manage passenger bookings on your daily or weekend highway commute.'
  },
  'post-ride': {
    title: 'Publish a Highway Corridor Departure | DriveIT Pilot Hub',
    description: 'Post empty vehicle seats with AI dynamic pricing, EV green bonus, and automated NHAI toll calculation.'
  },
  'booker-trips': {
    title: 'My Trips & Active Boarding Passes | DriveIT Passenger Hub',
    description: 'View confirmed trip reservations, 4-digit boarding safety PINs, real-time pilot GPS tracking, and past receipts.'
  },
  'privacy-policy': {
    title: 'Privacy Policy & Data Charter (DPDP Act 2023) | DriveIT',
    description: 'Learn how DriveIT protects your personal data under the Digital Personal Data Protection Act 2023 with strict data minimization.'
  },
  'terms-of-service': {
    title: 'Terms of Service & Non-Commercial Carpooling Charter | DriveIT',
    description: 'Review the non-commercial cost-sharing rules, 1-active-trip integrity policy, and safety guidelines under the Indian Motor Vehicles Act.'
  },
  'support-portal': {
    title: 'Operations & Trust Desk | DriveIT',
    description: 'Access 24/7 passenger assistance, pilot document audits, and incident resolution.'
  }
};

export default function SEOHead({ currentPage, customTitle, customDescription }) {
  useEffect(() => {
    const meta = PAGE_SEO_METADATA[currentPage] || PAGE_SEO_METADATA.home;
    const finalTitle = customTitle || meta.title;
    const finalDescription = customDescription || meta.description;

    document.title = finalTitle;

    // Update Meta Description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', finalDescription);

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', finalDescription);

    // Update Twitter Title & Description
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', finalTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', finalDescription);
  }, [currentPage, customTitle, customDescription]);

  return null;
}
