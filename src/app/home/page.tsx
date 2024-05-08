"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { data: session, status } = useSession();

  const profileImage = session?.user?.profilePicture;
  const defaultImage =
    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "unauthenticated") {
    return <p>You are not signed in. Please sign in to view your profile.</p>;
  }

  return (
    <div className="container mx-auto text-center flex flex-col justify-center items-center min-h-screen gap-8">
      <img
        src={profileImage || defaultImage}
        width={100}
        height={100}
        alt="Picture of the author"
        className="rounded-md"
      />
      <div>
        <p>{session?.user.username}</p>
      </div>
      <Button onClick={() => signOut({ callbackUrl: "/" })}>logout</Button>
      <ModeToggle />
    </div>
  );
};

export default Page;
