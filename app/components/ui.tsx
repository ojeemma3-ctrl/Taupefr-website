// Small shared building blocks used by the page and the dashboard.

export function Button({
  children,
  onClick,
  quiet = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  quiet?: boolean;
}) {
  return (
    <button onClick={onClick} className={"button " + (quiet ? "quiet" : "")}>
      {children}
      <span>→</span>
    </button>
  );
}

export function Heading({
  stage,
  title,
  copy,
  action,
}: {
  stage: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="heading">
      <div>
        <p className="eyebrow">{stage}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action}
    </header>
  );
}
