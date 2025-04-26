"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function addCardServer(cardData: any, userId: string) {
  try {
    // Update Clerk user metadata with card details
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        cards: cardData, // Save card data in public metadata
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving card data:", error);
    throw new Error("Failed to save card data.");
  }
}