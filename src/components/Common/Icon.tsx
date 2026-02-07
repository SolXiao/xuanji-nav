'use client';

import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) return <Icons.Link {...props} />;
  return <LucideIcon {...props} />;
};
