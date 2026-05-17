import './SectionHeader.scss';

export default function SectionHeader({ number, label, title, align = 'left' }) {
  return (
    <header className={`section-header section-header--${align}`}>
      <div className="section-header__eyebrow">
        <span className="section-header__num">{number}</span>
        <span className="section-header__line" />
        <span className="section-header__label">{label}</span>
      </div>
      {title && <h2 className="section-header__title">{title}</h2>}
    </header>
  );
}
