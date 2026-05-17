'use client';

import { useState } from 'react';
import { experience } from '@data';
import './ExperienceTabs.scss';

export default function ExperienceTabs() {
  const [activeId, setActiveId] = useState(experience[0].id);
  const activeIndex = experience.findIndex((j) => j.id === activeId);
  const activeJob = experience[activeIndex];

  return (
    <div className="exp-tabs" style={{ '--tab-count': experience.length }}>
      <div className="exp-tabs__list" role="tablist" aria-label="Work history">
        <span
          className="exp-tabs__indicator"
          style={{ '--active-index': activeIndex }}
          aria-hidden="true"
        />
        {experience.map((job) => (
          <button
            key={job.id}
            type="button"
            role="tab"
            id={`tab-${job.id}`}
            aria-selected={activeId === job.id}
            aria-controls={`panel-${job.id}`}
            tabIndex={activeId === job.id ? 0 : -1}
            className={`exp-tabs__tab ${activeId === job.id ? 'exp-tabs__tab--active' : ''}`}
            onClick={() => setActiveId(job.id)}
          >
            {job.company}
          </button>
        ))}
      </div>

      <div
        id={`panel-${activeJob.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeJob.id}`}
        className="exp-tabs__panel"
        key={activeJob.id}
      >
        <h3 className="exp-tabs__role">
          {activeJob.role}{' '}
          <span className="exp-tabs__at">@</span>{' '}
          <span className="exp-tabs__company">
            {activeJob.url
              ? <a href={activeJob.url} target="_blank" rel="noopener noreferrer" className="exp-tabs__company-link">{activeJob.company}</a>
              : activeJob.company}
          </span>
        </h3>

        <p className="exp-tabs__period mono">
          {activeJob.period} · {activeJob.location}
        </p>

        <ul className="exp-tabs__bullets">
          {activeJob.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
        </ul>
      </div>
    </div>
  );
}
