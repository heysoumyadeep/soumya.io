import { Poppins, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@hooks/useTheme.jsx';
import CursorGlow from '@components/cursor-glow/CursorGlow.client.jsx';
import NavigationLoader from '@components/navigation-loader/NavigationLoader.jsx';
import InitialLoader from '@components/loader/InitialLoader.jsx';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SITE_CONFIG } from '@config/site';
import '@styles/global.scss';

// next/font self-hosts fonts at build time, no external requests, no FOUT.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Soumyadeep Pradhan - Full-Stack Developer | soumya.io',
    template: '%s | Soumyadeep Pradhan',
  },
  description:
    'Soumyadeep Pradhan (heysoumyadeep), Full-Stack Developer (SDE2) at JPMorgan Chase. Building thoughtful software with Next.js, Node.js, Java, Spring Boot, and AWS. Based in India.',
  authors: [{ name: 'Soumyadeep Pradhan' }],
  creator: 'Soumyadeep Pradhan',
  publisher: 'Soumyadeep Pradhan',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    title: 'Soumyadeep Pradhan - Full-Stack Developer',
    description:
      'Full-Stack Developer (SDE2) at JPMorgan Chase. Building thoughtful software across the stack.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Soumyadeep Pradhan - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@heysoumyadeep',
    creator: '@heysoumyadeep',
    title: 'Soumyadeep Pradhan - Full-Stack Developer',
    description:
      'Full-Stack Developer (SDE2) at JPMorgan Chase. Building thoughtful software across the stack.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Soumyadeep',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Soumyadeep Pradhan',
  other: {
    'msapplication-TileColor': '#c72c41',
    'profile:username': 'heysoumyadeep',
    'geo.region': 'IN',
    'geo.placename': 'Pune, India',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdf6f0' },
    { media: '(prefers-color-scheme: dark)', color: '#1c031b' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Inline theme bootstrap that runs before first paint.
// <html> starts with visibility:hidden so nothing flashes before this script
// reads localStorage and sets the correct data-theme. Works for both first
// visits (defaults to dark) and returning users (restores their preference).
const themeBootstrap = `(function(){try{var s=localStorage.getItem('portfolio:theme');var t=(s==='light'||s==='dark')?s:'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}document.documentElement.style.visibility='';if('scrollRestoration'in history)history.scrollRestoration='manual';})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="dark"
      className={`${poppins.variable} ${jetbrains.variable}`}
      style={{ visibility: 'hidden' }}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* Theme bootstrap. Runs before first paint to set the right theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <InitialLoader />
        <NavigationLoader />
        <ThemeProvider>
          <CursorGlow />
          {children}
        </ThemeProvider>

        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}

        <Analytics />
        <SpeedInsights />

        <script
          defer
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="heysoumyadeep"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#C72C41"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        />
      </body>
    </html>
  );
}
