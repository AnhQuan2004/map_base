import { Globe } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Search } from "./Search";
import { Builder } from "@/types";

interface NavigationProps {
  onSelect: (builder: Builder) => void;
}

export const Navigation = ({ onSelect }: NavigationProps) => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-background/70 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Ramforge
            </span>
          </div>

          {/* Search */}
          <Search onSelect={onSelect} />

          {/* Connect Wallet Button */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
