import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
  // Ambil komponen icon dari Lucide berdasarkan nama string
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Code2;

  return <IconComponent className={className} />;
}
