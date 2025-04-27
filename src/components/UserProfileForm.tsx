
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { checkUsernameExists, createUserRecord } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

const UserProfileForm = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsSubmitting(true);
    setUsernameError('');
    
    try {
      // Check if username exists
      setIsChecking(true);
      const exists = await checkUsernameExists(username);
      if (exists) {
        setUsernameError('Username already exists. Please choose another one.');
        setIsChecking(false);
        setIsSubmitting(false);
        return;
      }
      setIsChecking(false);
      
      // Update user profile
      await createUserRecord(currentUser.uid, {
        name: currentUser.displayName,
        email: currentUser.email,
        username,
        phoneNumber,
        isVerified: true,
        createdAt: new Date(),
      });
      
      toast({
        title: "Profile updated successfully",
        description: "You can now start using the Password Vault!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username (must be unique)
            </label>
            <Input
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              disabled={isChecking || isSubmitting}
            />
            {usernameError && (
              <p className="text-sm text-red-600">{usernameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <CardFooter className="px-0 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              disabled={isChecking || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
