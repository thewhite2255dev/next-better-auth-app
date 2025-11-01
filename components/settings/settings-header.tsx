"use client";

import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  title: string;
  description?: string;
}

export function SettingsHeader({ title, description }: HeaderProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-medium">{title}</h1>
      {description && <h2>{description}</h2>}
      <Separator className="w-full" />
    </div>
  );
}
