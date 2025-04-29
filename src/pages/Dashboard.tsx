import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Key,
  LogOut,
  UserRound,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc, getDoc, deleteField } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import SearchBar from "@/components/SearchBar";
import PasswordItem from "@/components/PasswordItem";
import CardItem from "@/components/CardItem";
import EmptyState from "@/components/EmptyState";
import AddButton from "@/components/AddButton";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("passwords");
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { currentUser, userProfile, signOut } = useAuth();
  const { toast } = useToast();

  const user = currentUser;

  // Password states
  const [passwords, setPasswords] = useState<Record<string, any>>({});
  const [revealedPasswordId, setRevealedPasswordId] = useState<string | null>(
    null
  );
  const [newPassword, setNewPassword] = useState({
    id: "",
    website: "",
    username: "",
    passwordVal: "",
  });

  // Credit card states
  const [cards, setCards] = useState<Record<string, any>>({});
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    id: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Fetch user's data
  const fetchUserData = async () => {
    try {
      if (user?.email) {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setPasswords(userData.passwords || {});
          setCards(userData.creditCards || {});
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch your data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const togglePasswordVisibility = (id: string) => {
    if (revealedPasswordId === id) {
      setRevealedPasswordId(null);
    } else {
      setRevealedPasswordId(id);
    }
  };

  const toggleCardVisibility = (id: string) => {
    if (revealedCardId === id) {
      setRevealedCardId(null);
    } else {
      setRevealedCardId(id);
    }
  };

  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user?.uid) return;

      const passwordId = Date.now().toString();
      const encodedPassword = btoa(newPassword.passwordVal);

      const passwordData = {
        id: passwordId,
        website: newPassword.website,
        username: newPassword.username,
        passwordVal: encodedPassword,
        createdAt: new Date().toISOString(),
      };

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`passwords.${passwordId}`]: passwordData,
      });

      // Update local state
      setPasswords((prev) => ({
        ...prev,
        [passwordId]: passwordData,
      }));

      setNewPassword({ id: "", website: "", username: "", passwordVal: "" });
      setIsAddingPassword(false);
      toast({
        title: "Password added",
        description: "Your password has been securely saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user?.uid) return;

      const cardId = Date.now().toString();
      const encodedCardNumber = btoa(newCard.cardNumber);
      const encodedCvv = btoa(newCard.cvv);

      const cardData = {
        id: cardId,
        cardName: newCard.cardName,
        cardNumber: encodedCardNumber,
        expiryDate: newCard.expiryDate,
        cvv: encodedCvv,
        createdAt: new Date().toISOString(),
      };

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`creditCards.${cardId}`]: cardData,
      });

      // Update local state
      setCards((prev) => ({
        ...prev,
        [cardId]: cardData,
      }));

      setNewCard({
        id: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
      setIsAddingCard(false);
      toast({
        title: "Card added",
        description: "Your card has been securely saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      if (!user?.uid) return;

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`passwords.${id}`]: deleteField(),
      });

      // Update local state
      const newPasswords = { ...passwords };
      delete newPasswords[id];
      setPasswords(newPasswords);

      toast({
        title: "Password deleted",
        description: "Your password has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      if (!user?.uid) return;

      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`creditCards.${id}`]: deleteField(),
      });

      // Update local state
      const newCards = { ...cards };
      delete newCards[id];
      setCards(newCards);

      toast({
        title: "Card deleted",
        description: "Your card has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete card. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format card number to show only last 4 digits
  const formatCardNumber = (cardNumber: string) => {
    try {
      const decoded = atob(cardNumber);
      return `•••• •••• •••• ${decoded.slice(-4)}`;
    } catch (error) {
      return "•••• •••• •••• ••••";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      duration: 2000,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortItems = <T extends Record<string, any>>(
    items: Record<string, T>
  ) => {
    return Object.values(items).sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt > b.createdAt ? 1 : -1;
      } else {
        return a.createdAt < b.createdAt ? 1 : -1;
      }
    });
  };

  const filteredPasswords = sortItems(passwords).filter(
    (password) =>
      password.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = sortItems(cards).filter((card) =>
    card.cardName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //<div className="max-w-3xl mx-auto p-4 md:p-6 bg-white min-h-screen">

  return (
    <div className=" w-full h-full bg-[radial-gradient(circle_at_center,#00d2de_0%,#3824b4_50%,#151540_100%)]">
      <div className="max-w-3xl mx-auto p-4 md:p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SecureVault</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-9 w-9">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.photoURL || ""}
                    alt={user?.displayName || "User"}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-vault-purple-light text-vault-purple-dark">
                    {getInitials(user?.displayName || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Separator />
              <DropdownMenuItem className="cursor-pointer">
                <UserRound className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by website, username, or card name..."
          />
        </div>

        <Tabs
          defaultValue="passwords"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="passwords" className="text-sm">
                Passwords
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-sm">
                Cards
              </TabsTrigger>
            </TabsList>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortOrder}
              className="text-xs text-white flex items-center"
            >
              {sortOrder === "desc" ? (
                <>
                  Newest first <ArrowDown className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  Oldest first <ArrowUp className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </div>

          <TabsContent value="passwords" className="mt-0">
            <Dialog open={isAddingPassword} onOpenChange={setIsAddingPassword}>
              <div className="mb-5">
                <AddButton
                  onClick={() => setIsAddingPassword(true)}
                  label="Add New Password"
                />
              </div>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                  <DialogDescription>
                    Securely store your login credentials
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPassword}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="Website URL or name"
                        value={newPassword.website}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            website: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Email or username"
                        value={newPassword.username}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={newPassword.passwordVal}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            passwordVal: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-vault-purple hover:bg-vault-purple-dark"
                    >
                      Save Password
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {Object.values(passwords).length === 0 ? (
                <EmptyState type="passwords" />
              ) : filteredPasswords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No matching passwords found
                </div>
              ) : (
                filteredPasswords.map((password) => (
                  <PasswordItem
                    key={password.id}
                    password={password}
                    isRevealed={revealedPasswordId === password.id}
                    onToggleReveal={togglePasswordVisibility}
                    onCopy={copyToClipboard}
                    onDelete={handleDeletePassword}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cards" className="mt-0">
            <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
              <div className="mb-5">
                <AddButton
                  onClick={() => setIsAddingCard(true)}
                  label="Add New Credit Card"
                />
              </div>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Credit Card</DialogTitle>
                  <DialogDescription>
                    Securely store your payment information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCard}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Card Name</Label>
                      <Input
                        id="cardName"
                        placeholder="Card nickname (e.g. Personal Visa)"
                        value={newCard.cardName}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={newCard.cardNumber}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={newCard.expiryDate}
                          onChange={(e) =>
                            setNewCard({
                              ...newCard,
                              expiryDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={newCard.cvv}
                          onChange={(e) =>
                            setNewCard({ ...newCard, cvv: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-vault-purple hover:bg-vault-purple-dark"
                    >
                      Save Card
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {Object.values(cards).length === 0 ? (
                <EmptyState type="cards" />
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No matching cards found
                </div>
              ) : (
                filteredCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    isRevealed={revealedCardId === card.id}
                    onToggleReveal={toggleCardVisibility}
                    onCopy={copyToClipboard}
                    onDelete={handleDeleteCard}
                    formatCardNumber={formatCardNumber}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
