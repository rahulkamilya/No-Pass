"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, Lock, User } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
// Example: Import a toast component if you use one
// import { toast } from "@/components/ui/use-toast";

export default function AddCard() {
  const { userId, getToken } = useAuth();
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    
    setStatusMessage(null);

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setCardData({ ...cardData, [name]: formatted });
      return;
    }

    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      setCardData({ ...cardData, [name]: formatted });
      return;
    }

    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); // Clear previous messages

    if (!userId) {
      console.error("User is not authenticated.");
       setStatusMessage({ type: 'error', message: 'You must be logged in to save a card.' });
      return;
    }

    // --- Suggestion: Set loading state ---
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        // Handle case where token couldn't be retrieved (e.g., session expired)
        throw new Error("Authentication token not available.");
      }

      const response = await fetch("/api/save-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
        
        body: JSON.stringify({ cardData }),
      });

      
      if (!response.ok) {
         let errorMessage = `Failed to save card data. Status: ${response.status}`;
         try {
           const errorBody = await response.json();
           errorMessage = errorBody.error || errorMessage; // Use server error message if available
         } catch (jsonError) {
           // Response body wasn't JSON or couldn't be parsed
           console.error("Could not parse error response body:", jsonError);
         }
        throw new Error(errorMessage);
      }

      const result = await response.json(); // Assuming backend sends { message: "..." } on success
      console.log("Card data saved successfully:", result);
      
      setStatusMessage({ type: 'success', message: result.message || 'Card saved successfully!' });
      // Use toast({ title: "Success", description: result.message || 'Card saved successfully!' });

      // Reset form
      setCardData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      });

    } catch (error) {
      console.error("Error saving card data:", error);
      
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatusMessage({ type: 'error', message: message });
      // Use toast({ variant: "destructive", title: "Error", description: message });

    } finally {
      
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Card Number */}
        <div className="space-y-2">
           <Label htmlFor="cardNumber" className="flex items-center gap-2">
             <CreditCard className="h-4 w-4" />
             Card Number
           </Label>
           <Input
             id="cardNumber"
             name="cardNumber"
             placeholder="1234 5678 9012 3456"
             value={cardData.cardNumber}
             onChange={handleChange}
             maxLength={19} // 16 digits + 3 spaces
             required
             className="font-mono"
             disabled={isLoading} // Disable when loading
           />
         </div>

         {/* Expiry and CVV */}
         <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="expiryDate" className="flex items-center gap-2">
               <Calendar className="h-4 w-4" />
               Expiry Date
             </Label>
             <Input
               id="expiryDate"
               name="expiryDate"
               placeholder="MM/YY"
               value={cardData.expiryDate}
               onChange={handleChange}
               maxLength={5} // MM/YY
               required
               className="font-mono"
               disabled={isLoading} // Disable when loading
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="cvv" className="flex items-center gap-2">
               <Lock className="h-4 w-4" />
               CVV
             </Label>
             <Input
               id="cvv"
               name="cvv"
               type="password" // Keep as password for masking
               placeholder="123"
               value={cardData.cvv}
               onChange={handleChange}
               maxLength={4} // Can be 3 or 4 digits
               required
               pattern="\d{3,4}" // Basic pattern validation
               title="Please enter 3 or 4 digits"
               className="font-mono"
               disabled={isLoading} // Disable when loading
             />
           </div>
         </div>

         {/* Cardholder Name */}
         <div className="space-y-2">
           <Label htmlFor="cardholderName" className="flex items-center gap-2">
             <User className="h-4 w-4" />
             Cardholder Name
           </Label>
           <Input
             id="cardholderName"
             name="cardholderName"
             placeholder="John Doe"
             value={cardData.cardholderName}
             onChange={handleChange}
             required
             disabled={isLoading} // Disable when loading
           />
         </div>

        {/* --- Suggestion: Display Status Message --- */}
        {statusMessage && (
          <div className={`text-sm ${statusMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {statusMessage.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {/* --- Suggestion: Show loading text --- */}
          {isLoading ? "Saving..." : "Save Card"}
        </Button>
      </div>
    </form>
  );
}