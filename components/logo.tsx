import Image from "next/image";

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Image 
      src="/klick_logo.png" 
      alt="Klick" 
      width={160} 
      height={40} 
      className={className}
      priority
    />
  );
}
