"use client";

import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className={cn("mt-4 border-t", "bg-background text-foreground")}>
      <div className="container mx-auto px-6 py-3">
        <div className="text-center">
          &copy; {new Date().getFullYear()} CryptoVoyage. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
