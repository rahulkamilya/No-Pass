import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit, Trash, CreditCard } from "lucide-react";

interface CardItemProps {
  card: {
    id: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  isRevealed: boolean;
  onToggleReveal: (id: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  formatCardNumber: (cardNumber: string) => string;
}

const CardItem = ({
  card,
  isRevealed,
  onToggleReveal,
  onCopy,
  onDelete,
  formatCardNumber,
}: CardItemProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-vault-gray to-white p-4 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-900">{card.cardName}</h3>
            <CreditCard className="h-5 w-5 text-vault-purple" />
          </div>
          <div className="font-mono text-lg text-gray-700 mb-3 flex items-center gap-2">
            <span>
              {isRevealed
                ? atob(card.cardNumber)
                : formatCardNumber(card.cardNumber)}
            </span>
            {isRevealed && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full hover:bg-white/30"
                onClick={() => onCopy(atob(card.cardNumber))}
              >
                <Copy className="h-3.5 w-3.5 text-gray-500" />
                <span className="sr-only">Copy card number</span>
              </Button>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-gray-600">
              <span>Expires: {card.expiryDate}</span>
            </div>
            <div className="font-mono flex items-center gap-1.5">
              <span>CVV: {isRevealed ? atob(card.cvv) : "•••"}</span>
              {isRevealed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-white/30"
                  onClick={() => onCopy(atob(card.cvv))}
                >
                  <Copy className="h-3 w-3 text-gray-500" />
                  <span className="sr-only">Copy CVV</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2 bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleReveal(card.id)}
          className="text-sm text-gray-600 hover:bg-gray-50"
        >
          {isRevealed ? (
            <>
              <EyeOff className="h-4 w-4 mr-1.5" /> Hide Details
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1.5" /> Show Details
            </>
          )}
        </Button>
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
            onClick={() => onDelete(card.id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
