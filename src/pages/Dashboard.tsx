import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lock,
  LogOut,
  User,
  Eye,
  EyeOff,
  Trash,
  Edit,
  CreditCard,
  Plus,
  Search,
  Mail,
  UserRound,
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
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("passwords");
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, userProfile, signOut } = useAuth();
  const { toast } = useToast();

  const user = currentUser;
  // console.log(user);
  // const res = user?.photoURL ? user.photoURL : null;
  // console.log(res);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Lock className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Password Vault Dashboard
          </h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user?.photoURL ? (
              <Avatar className="w-10 h-10">
                <AvatarImage
                  className=" w-10 h-10 object-cover rounded-full"
                  src={user.photoURL}
                  alt="rahulkapapa"
                />
              </Avatar>
            ) : (
              <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                <div className="rounded-full w-10 h-10 bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50 items-center">
            <DropdownMenuItem className="cursor-pointer items-center">
              <UserRound className="mr-2 h-4 w-4" />
              <span>{user.displayName}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span>{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer items-center"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center bg-gray-50 rounded-md mb-6 px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          type="search"
          placeholder="Search by website, username, or card name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>

      <Tabs
        defaultValue="passwords"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="passwords" className="text-sm">
            Passwords
          </TabsTrigger>
          <TabsTrigger value="cards" className="text-sm">
            Credit Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passwords">
          {!isAddingPassword ? (
            <Button
              onClick={() => setIsAddingPassword(true)}
              className="w-full mb-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Password
            </Button>
          ) : (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleAddPassword}>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Website URL"
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
                    <div>
                      <Input
                        placeholder="Username"
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
                    <div>
                      <Input
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
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingPassword(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {Object.values(passwords).length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Lock className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm">No passwords saved yet</p>
              </div>
            ) : (
              Object.values(passwords)
                .filter(
                  (password: any) =>
                    password.website
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    password.username
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((password: any) => (
                  <Card key={password.id} className="overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {password.website}
                        </p>
                        <p className="text-sm text-gray-600">
                          {password.username}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="text-sm font-mono">
                            {revealedPasswordId === password.id
                              ? atob(password.passwordVal)
                              : "••••••••"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-8 w-8 p-0"
                            onClick={() =>
                              togglePasswordVisibility(password.id)
                            }
                          >
                            {revealedPasswordId === password.id ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeletePassword(password.id)}
                        >
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="cards">
          {!isAddingCard ? (
            <Button
              onClick={() => setIsAddingCard(true)}
              className="w-full mb-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Credit Card
            </Button>
          ) : (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleAddCard}>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Card Name"
                        value={newCard.cardName}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Card Number"
                        value={newCard.cardNumber}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cardNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Expiry (MM/YY)"
                        value={newCard.expiryDate}
                        onChange={(e) =>
                          setNewCard({ ...newCard, expiryDate: e.target.value })
                        }
                        required
                      />
                      <Input
                        placeholder="CVV"
                        type="password"
                        value={newCard.cvv}
                        onChange={(e) =>
                          setNewCard({ ...newCard, cvv: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingCard(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {Object.values(cards).length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <CreditCard className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm">No credit cards saved yet</p>
              </div>
            ) : (
              Object.values(cards)
                .filter((card: any) =>
                  card.cardName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((card: any) => (
                  <Card key={card.id} className="overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-white">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-800">
                          {card.cardName}
                        </p>
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="font-mono text-lg text-gray-700 my-3">
                        {revealedCardId === card.id
                          ? atob(card.cardNumber)
                          : formatCardNumber(card.cardNumber)}
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-600">
                          <span>Expires: {card.expiryDate}</span>
                        </div>
                        <div className="text-sm font-mono">
                          CVV:{" "}
                          {revealedCardId === card.id ? atob(card.cvv) : "•••"}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardVisibility(card.id)}
                        className="text-sm text-gray-600"
                      >
                        {revealedCardId === card.id ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" /> Hide Details
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" /> Show Details
                          </>
                        )}
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
