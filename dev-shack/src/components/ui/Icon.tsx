'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className = 'w-4 h-4', size = 16, ...props }: IconProps) {
  // Map icon name to Lucide component
  const LucideComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name] || LucideIcons.HelpCircle;

  return <LucideComponent className={className} size={size} {...props} />;
}
