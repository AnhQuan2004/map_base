import { useState } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { useSearchBuilders } from "@/hooks/useSearchBuilders";
import { Builder } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SearchProps {
  onSelect: (builder: Builder) => void;
}

export function Search({ onSelect }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { searchTerm, setSearchTerm, results, isLoading } = useSearchBuilders();

  const handleSelect = (builder: Builder) => {
    if (builder.location && builder.location.length === 2) {
      onSelect(builder);
    } else {
      // Handle no location - maybe show a toast?
      console.log("User has no location");
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Command shouldFilter={false} className="w-full max-w-xs">
      <CommandInput
        placeholder="Search for a builder..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      />
      {isOpen && (
        <CommandList>
          {isLoading && <CommandItem>Loading...</CommandItem>}
          {results && results.length > 0 ? (
            <CommandGroup heading="Suggestions">
              {results.map((builder: Builder) => (
                <CommandItem key={builder._id} onSelect={() => handleSelect(builder)} className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={builder.image_url} alt={builder.name} />
                    <AvatarFallback>{builder.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{builder.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            !isLoading && searchTerm && <CommandItem>No results found.</CommandItem>
          )}
        </CommandList>
      )}
    </Command>
  );
}
