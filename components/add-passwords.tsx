"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Globe, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"; 


export default function AddPasswords() {
  const { userId, getToken } = useAuth(); // Get Clerk auth methods
  const [passwordData, setPasswordData] = useState({
    website: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStatusMessage(null); 
    setPasswordData({ ...passwordData, [name]: value });

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive";
    if (passwordStrength < 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Medium";
    return "Strong";
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); // Clear previous messages

    if (!userId) {
      setStatusMessage({ type: 'error', message: 'You must be logged in to save a password.' });
      return;
    }


    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available.");
      }

      
      const apiUrl = "/api/save-password";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send Clerk token for auth
        },
        
        body: JSON.stringify({ passwordData }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to save password. Status: ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorMessage; // Use server error message if available
        } catch (jsonError) {
          console.error("Could not parse error response body:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json(); // Expecting { message: "..." } on success
      console.log("Password data saved successfully:", result);
      setStatusMessage({ type: 'success', message: result.message || 'Password saved successfully!' });
      

      
      setPasswordData({
        website: "",
        username: "",
        password: "",
      });
      setPasswordStrength(0);
      setShowPassword(false); 

    } catch (error) {
      console.error("Error saving password data:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatusMessage({ type: 'error', message: message });
      // toast({ variant: "destructive", title: "Error", description: message });

    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website or Service
          </Label>
          <Input
            id="website"
            name="website"
            placeholder="example.com"
            value={passwordData.website}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable when loading
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Username or Email
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="john.doe@example.com"
            value={passwordData.username}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable when loading
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={passwordData.password}
              onChange={handleChange}
              required
              className="pr-10"
              disabled={isLoading} // Disable when loading
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading} // Disable when loading
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>

          {/* Password Strength Meter */}
          {passwordData.password && !isLoading && ( // Hide meter while loading
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Password strength:</span>
                <span>{getStrengthText()}</span>
              </div>
              <Progress value={passwordStrength} className={getStrengthColor()} />
            </div>
          )}
        </div>

        {/* Status Message Display */}
        {statusMessage && (
          <div className={`text-sm p-2 rounded-md ${statusMessage.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}`}>
            {statusMessage.message}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Password"
          )}
        </Button>
      </div>
    </form>
  );
}