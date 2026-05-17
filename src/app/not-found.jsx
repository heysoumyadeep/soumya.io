import Link from '@components/link/Link';
import { Navbar, Footer, ParallaxBackground } from '@components';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <ParallaxBackground />
      <Navbar />
      <main className="not-found">
        <div className="not-found__inner container">
          <p className="not-found__code mono">404</p>
          <h1 className="not-found__title">Nothing here.</h1>
          <p className="not-found__lede">
            That page doesn&apos;t exist. It may have moved, or the URL might be off.
          </p>
          <Link href="/" className="not-found__btn">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
