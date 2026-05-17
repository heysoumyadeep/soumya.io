import { Suspense } from 'react';
import { Navbar, Footer, ParallaxBackground, SupportSnackbar } from '@components';
import Hero from '@features/hero/Hero';
import About from '@features/about/About';
import Experience from '@features/experience/Experience';
import Projects from '@features/projects/Projects';
import Writing from '@features/writing/Writing';
import Contact from '@features/contact/Contact';
import JsonLd from '@seo/JsonLd';
import {
  websiteSchema,
  personSchema,
  profilePageSchema,
  siteNavigationSchema,
  organizationSchema,
} from '@seo/schemas';
import RevealClient from '@/app/_RevealClient';
import AnalyticsTracker from '@lib/AnalyticsTracker';

export const metadata = {
  description:
    'Soumyadeep Pradhan (Soumya) - Full-Stack Developer (SDE2) at JPMorgan Chase. Building thoughtful software with Next.js, Node.js, Java, Spring Boot, and AWS. Based in India.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteSchema, personSchema, profilePageSchema, siteNavigationSchema, organizationSchema]} />
      <ParallaxBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Writing />
        <Contact />
      </main>
      <Footer />
      <SupportSnackbar />
      <RevealClient />
      <Suspense fallback={null}><AnalyticsTracker /></Suspense>
    </>
  );
}
