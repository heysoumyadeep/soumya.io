import { SectionHeader, ArrowRightIcon } from '@components';
import { projects } from '@data';
import { LINKS } from '@config/site';
import ProjectCard from './ProjectCard';
import './Projects.scss';

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="projects__head">
          <SectionHeader number="03" label="Projects" title="Things I've built." />
          <a
            href={LINKS.githubRepos}
            target="_blank"
            rel="noopener noreferrer"
            className="projects__see-more"
          >
            See more <ArrowRightIcon size={14} />
          </a>
        </div>

        <div className="projects__grid reveal">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
