// Shared "divider ─ Label ─ divider" section header used across home sections

interface SectionLabelProps {
  label: string;
  center?: boolean;
}

export default function SectionLabel({ label, center = true }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <div className="divider-gold" />
      <span className="label-section">{label}</span>
      {center && <div className="divider-gold" />}
    </div>
  );
}
