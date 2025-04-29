import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordItemProps {
  password: {
    id: string;
    website: string;
    username: string;
    passwordVal: string;
  };
  isRevealed: boolean;
  onToggleReveal: (id: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
}

const PasswordItem = ({
  password,
  isRevealed,
  onToggleReveal,
  onCopy,
  onDelete,
}: PasswordItemProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">{password.website}</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-600">
                  {password.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
                  onClick={() => onCopy(password.username)}
                >
                  <Copy className="h-3 w-3 text-gray-500" />
                  <span className="sr-only">Copy username</span>
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "text-sm font-mono py-1 px-2 rounded",
                    isRevealed ? "bg-vault-gray-light" : "bg-vault-gray"
                  )}
                >
                  {isRevealed ? atob(password.passwordVal) : "••••••••"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                  onClick={() => onToggleReveal(password.id)}
                >
                  {isRevealed ? (
                    <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {isRevealed ? "Hide" : "Show"} password
                  </span>
                </Button>
                {isRevealed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                    onClick={() => onCopy(atob(password.passwordVal))}
                  >
                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-red-50"
                onClick={() => onDelete(password.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordItem;
