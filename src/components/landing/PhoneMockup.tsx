type Props = { src: string; alt: string; className?: string };

export function PhoneMockup({ src, alt, className }: Props) {
  return (
    <div className={className ? `phone ${className}` : "phone"}>
      <div className="phone-screen">
        <span className="phone-notch" />
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
