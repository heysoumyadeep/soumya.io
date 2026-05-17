import './Button.scss';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  as: Tag = 'button',
  className = '',
  ...props
}) {
  const isButton = Tag === 'button';
  return (
    <Tag
      className={`btn btn--${variant} ${className}`}
      {...(isButton ? { type } : {})}
      {...props}
    >
      <span className="btn__label">{children}</span>
    </Tag>
  );
}
