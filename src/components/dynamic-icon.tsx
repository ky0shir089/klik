import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconName = keyof typeof LucideIcons;

type DynamicIconProps = {
  name: string;
  className?: string;
  fallback?: LucideIcon;
};

export default function DynamicIcon({
  name,
  className,
  fallback: Fallback = LucideIcons.HelpCircle,
}: DynamicIconProps) {
  const Icon =
    (LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) ?? Fallback;

  return <Icon className={className} />;
}
