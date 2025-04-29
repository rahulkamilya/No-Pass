import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

const AddButton = ({ onClick, label }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-full bg-vault-purple hover:bg-vault-purple-dark text-white transition-all duration-200 shadow-sm"
    >
      <Plus className="h-4 w-4 mr-2" /> {label}
    </Button>
  );
};

export default AddButton;
