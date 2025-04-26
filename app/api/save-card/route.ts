import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req: Request) {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { cardData } = body;
      if (
        !cardData?.cardNumber ||
        !cardData?.expiryDate ||
        !cardData?.cvv ||
        !cardData?.cardholderName
      ) {
        return NextResponse.json({ error: "Invalid card data" }, { status: 400 });
      }
      const user = await clerkClient.users.getUser(userId);
  
      const existingPrivateMetadata = user.privateMetadata || {};
      const existingCards = Array.isArray(existingPrivateMetadata.cards)
        ? existingPrivateMetadata.cards
        : [];
      const isDuplicate = existingCards.some(
        (card: any) => card.cardNumber === cardData.cardNumber
      );
  
      if (isDuplicate) {
        return NextResponse.json(
          { error: "Card already exists." },
          { status: 400 }
        );
      }
      const updatedCards = [...existingCards, cardData];
  
      // Save to Clerk user private metadata
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...existingPrivateMetadata,
          cards: updatedCards,
        },
      });
  
      console.log("Saving card details:", updatedCards);
  
      return NextResponse.json({ message: "Card saved successfully" });
    } catch (error) {
      console.error("Error saving card metadata:", error);
      return NextResponse.json(
        { error: "Failed to save card information." },
        { status: 500 }
      );
    }
  }

  export async function DELETE(req: Request) {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { cardNumber } = body;
  
      if (!cardNumber) {
        return NextResponse.json({ error: "Card number is required." }, { status: 400 });
      }
      const user = await clerkClient.users.getUser(userId);
  
      const existingPrivateMetadata = user.privateMetadata || {};
      const existingCards = Array.isArray(existingPrivateMetadata.cards)
        ? existingPrivateMetadata.cards
        : [];
      const updatedCards = existingCards.filter(
        (card: any) => card.cardNumber !== cardNumber
      );
  
      if (existingCards.length === updatedCards.length) {
        return NextResponse.json(
          { error: "Card not found." },
          { status: 404 }
        );
      }
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...existingPrivateMetadata,
          cards: updatedCards,
        },
      });
  
      console.log("Deleted card:", cardNumber);
      return NextResponse.json({ message: "Card deleted successfully." });
    } catch (error) {
      console.error("Error deleting card metadata:", error);
      return NextResponse.json(
        { error: "Failed to delete card information." },
        { status: 500 }
      );
    }
  }