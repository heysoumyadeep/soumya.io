import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from '../icons/Icons';
import { personalInfo } from '@data';
import './Footer.scss';

const SOCIAL_ITEMS = [
  { label: 'GitHub', href: personalInfo.social.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: personalInfo.social.linkedin, Icon: LinkedinIcon },
  { label: 'Twitter', href: personalInfo.social.twitter, Icon: TwitterIcon },
  { label: 'Email', href: `mailto:${personalInfo.email}`, Icon: MailIcon },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__content">
          <div className="footer__left">
            <p className="footer__credit">
              Designed and built by{' '}
              <span className="footer__credit-name">Soumyadeep Pradhan</span>
              <span className="footer__pulse" aria-hidden="true">♡</span>
            </p>
            <p className="footer__meta">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
          </div>

          <ul className="footer__social" aria-label="Social links">
            {SOCIAL_ITEMS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer"
                   aria-label={label} className="footer__social-link">
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
