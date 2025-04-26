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
    const { passwordData } = body;
    if (
      !passwordData?.website ||
      !passwordData?.username ||
      !passwordData?.password
    ) {
      return NextResponse.json({ error: "Invalid password data" }, { status: 400 });
    }
    const user = await clerkClient.users.getUser(userId);

    const existingPrivateMetadata = user.privateMetadata || {};
    const existingPasswords = Array.isArray(existingPrivateMetadata.passwords)
      ? existingPrivateMetadata.passwords
      : [];
    const isDuplicate = existingPasswords.some(
      (password: any) =>
        password.website === passwordData.website &&
        password.username === passwordData.username
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "Password for this website and username already exists." },
        { status: 400 }
      );
    }
    const updatedPasswords = [...existingPasswords, passwordData];
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...existingPrivateMetadata,
        passwords: updatedPasswords,
      },
    });

    console.log("Saving password details:", updatedPasswords);

    return NextResponse.json({ message: "Password saved successfully" });
  } catch (error) {
    console.error("Error saving password metadata:", error);
    return NextResponse.json(
      { error: "Failed to save password information." },
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
    const { updatedPasswords } = body;
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        passwords: updatedPasswords,
      },
    });

    return NextResponse.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error("Error deleting password metadata:", error);
    return NextResponse.json(
      { error: "Failed to delete password information." },
      { status: 500 }
    );
  }
}