"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface PasswordData {
  id: string;
  website: string;
  username: string;
  password: string;
}

export default function YourPasswords() {
  const { isLoaded, isSignedIn, user } = useUser(); 
  const [passwords, setPasswords] = useState<PasswordData[]>([]); 
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({}); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchedPasswords = (user as any)?.privateMetadata?.passwords || [];
      if (Array.isArray(fetchedPasswords)) {
        setPasswords(fetchedPasswords);
        console.log("Fetched passwords from database:", fetchedPasswords);
      } else {
        setPasswords([]);
        console.log("No passwords found in the database.");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Password copied to clipboard:", text);
  };

  
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedPasswords = passwords.filter((password) => password.id !== id);

      
      await fetch("/api/save-password", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedPasswords }),
      });

      setPasswords(updatedPasswords);
      console.log("Password deleted successfully:", id);
    } catch (err) {
      console.error("Error deleting password:", err);
      setError("Failed to delete password.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const formatWebsiteUrl = (website: string) => {
    if (!website.startsWith("http")) {
      return `https://${website}`;
    }
    return website;
  };

  return (
    <div className="space-y-4">
      {passwords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No passwords saved yet.</div>
      ) : (
        passwords.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {item.website.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.website}</h3>
                    <p className="text-sm text-muted-foreground">{item.username}</p>
                  </div>
                </div>
                <a
                  href={formatWebsiteUrl(item.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visit {item.website}</span>
                </a>
              </div>

              <div className="flex items-center mt-3 border rounded-md overflow-hidden">
                <div className="flex-1 px-3 py-1 font-mono">
                  {visiblePasswords[item.id] ? item.password : "••••••••••••"}
                </div>
                <div className="flex border-l">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => togglePasswordVisibility(item.id)}
                  >
                    {visiblePasswords[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{visiblePasswords[item.id] ? "Hide" : "Show"} password</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => handleCopy(item.password)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete password</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}