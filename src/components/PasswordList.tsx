
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getUserPasswords, deletePassword } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

interface PasswordListProps {
  searchQuery: string;
}

interface Password {
  id: string;
  website: string;
  username: string;
  passwordVal: string;
}

const PasswordList = ({ searchQuery }: PasswordListProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userPasswords = await getUserPasswords(currentUser.uid);
        setPasswords(userPasswords);
      } catch (error) {
        console.error("Error fetching passwords:", error);
        toast({
          title: "Error",
          description: "Failed to load passwords",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPasswords();
  }, [currentUser, toast]);

  const togglePasswordVisibility = (passwordId: string) => {
    setVisiblePasswords(prev => 
      prev.includes(passwordId)
        ? prev.filter(id => id !== passwordId)
        : [...prev, passwordId]
    );
  };

  const handleDelete = async (passwordId: string) => {
    if (!currentUser) return;
    
    try {
      await deletePassword(passwordId);
      setPasswords(prev => prev.filter(password => password.id !== passwordId));
      toast({
        title: "Success",
        description: "Password deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast({
        title: "Error",
        description: "Failed to delete password",
        variant: "destructive",
      });
    }
  };

  const filteredPasswords = passwords.filter(
    (pass) =>
      pass.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading passwords...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredPasswords.map((pass) => (
        <Card key={pass.id} className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <Key className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{pass.website}</h3>
              <p className="text-sm text-gray-500">{pass.username}</p>
              <div className="flex items-center mt-1">
                <p className="text-xs mr-2 font-mono">
                  {visiblePasswords.includes(pass.id) 
                    ? pass.passwordVal 
                    : '•'.repeat(8)}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => togglePasswordVisibility(pass.id)}
                >
                  {visiblePasswords.includes(pass.id) 
                    ? <EyeOff className="w-3 h-3" /> 
                    : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600"
                onClick={() => handleDelete(pass.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {filteredPasswords.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No passwords found
        </div>
      )}
    </div>
  );
};

export default PasswordList;
