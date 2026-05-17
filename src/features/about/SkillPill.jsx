import './SkillPill.scss';

export default function SkillPill({ skill, index }) {
  return (
    <li
      className="skill-pill"
      style={{
        '--skill-color': skill.color,
        '--skill-text': skill.textColor,
        '--skill-delay': `${index * 60}ms`,
      }}
    >
      <span
        className="skill-pill__dot"
        style={{ background: skill.color }}
        aria-hidden="true"
      />
      <span className="skill-pill__name">{skill.name}</span>
    </li>
  );
}
