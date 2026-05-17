import { SectionHeader } from '@components';
import { personalInfo } from '@data';
import ContactForm from './ContactForm';
import './Contact.scss';

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHeader
          number="05"
          label="Get in touch"
          title="Let's connect."
          align="center"
        />

        <p className="contact__lede reveal">
          Open to discussing new ideas, collaborations, or just trading notes
          on tech and craft. Drop me a line, I read everything.
        </p>

        <div className="contact__wrap reveal">
          <ContactForm />
          <p className="contact__direct">
            Prefer email?{' '}
            <a href={`mailto:${personalInfo.email}`} className="contact__email">
              {personalInfo.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
