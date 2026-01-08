type LogoProps = {
    className?: string;
};

export default function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Kirana Logo"
      className={`h-auto max-h-[250px] w-auto max-w-[500px] object-contain ${className}`}
      onError={(e) => {
        e.currentTarget.style.display = 'none'; // Hide on error for robustness
      }}
    />
  );
}