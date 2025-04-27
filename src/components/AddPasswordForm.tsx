
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { addPassword } from '@/services/dataService';

interface AddPasswordFormProps {
  onComplete: () => void;
}

const AddPasswordForm = ({ onComplete }: AddPasswordFormProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    passwordVal: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save passwords",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addPassword(currentUser.uid, formData);
      
      toast({
        title: "Password saved",
        description: "Your password has been securely stored.",
      });
      onComplete();
    } catch (error: any) {
      console.error("Error saving password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="url"
          placeholder="Website URL"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          required
          className="mb-2"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Username or Email"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="mb-2"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={formData.passwordVal}
          onChange={(e) => setFormData({ ...formData, passwordVal: e.target.value })}
          required
          className="mb-4"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default AddPasswordForm;
