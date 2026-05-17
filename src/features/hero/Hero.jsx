import Link from '@components/link/Link';
import { Button } from '@components';
import { personalInfo } from '@data';
import { LINKS } from '@config/site';
import './Hero.scss';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <p className="hero__greeting reveal">Hey there, I&apos;m</p>

        <h1 className="hero__name reveal">
          <span className="gradient-text">{personalInfo.name}</span>
          <span className="hero__dot">.</span>
        </h1>

        <p className="hero__tagline reveal">
          {personalInfo.tagline}
        </p>

        <div className="hero__cta reveal">
          <Button
            variant="primary"
            as="a"
            href={LINKS.topmate}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a 1:1{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '2px' }}
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Button>
          <Button variant="ghost" as={Link} href="/blog">
            See my blogs
          </Button>
        </div>
      </div>
    </section>
  );
}
