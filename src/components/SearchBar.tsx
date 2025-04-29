import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 bg-vault-gray border-0 focus-visible:ring-1 focus-visible:ring-vault-purple/50 shadow-none rounded-full"
      />
    </div>
  );
};

export default SearchBar;
