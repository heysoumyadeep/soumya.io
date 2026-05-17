'use client';

import { memo, useCallback } from 'react';
import { GithubIcon, ExternalLinkIcon } from '@components';
import './ProjectCard.scss';

const ProjectCard = memo(function ProjectCard({ project }) {
  const cardHref = project.github || project.link || null;

  const handleCardClick = useCallback((e) => {
    if (e.target.closest('.project-card__links')) return;
    if (!cardHref) return;
    window.open(cardHref, '_blank', 'noopener,noreferrer');
  }, [cardHref]);

  const handleKeyDown = useCallback((e) => {
    if (!cardHref) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(cardHref, '_blank', 'noopener,noreferrer');
    }
  }, [cardHref]);

  return (
    <div
      className="project-card"
      role="link"
      tabIndex={0}
      aria-label={project.title}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      data-href={cardHref || undefined}
    >
      <div className="project-card__top">
        <div className="project-card__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <div className="project-card__links">
          {project.recentProject && (
            <span className="project-card__recent-tag">Recent project</span>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               aria-label={`${project.title} source`}>
              <GithubIcon size={18} />
            </a>
          )}
          {project.link && project.link !== project.github && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
               aria-label={`${project.title} live demo`}>
              <ExternalLinkIcon size={18} />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__description">{project.description}</p>

      <ul className="project-card__stack">
        {project.stack.map((tech) => (
          <li key={tech} className="mono">{tech}</li>
        ))}
      </ul>
    </div>
  );
});

export default ProjectCard;
