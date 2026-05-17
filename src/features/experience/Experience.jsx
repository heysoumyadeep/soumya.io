import { SectionHeader } from '@components';
import ExperienceTabs from './ExperienceTabs';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeader number="02" label="Experience" title="Where I've worked." />
        <div className="reveal">
          <ExperienceTabs />
        </div>
      </div>
    </section>
  );
}
