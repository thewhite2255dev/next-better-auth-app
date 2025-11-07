"use client";

import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SettingsHeader({ title, description }: HeaderProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-medium">{title}</h1>
      {description && <p>{description}</p>}
      <Separator className="w-full" />
    </div>
  );
}
