"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="sticky top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30 py-3">
      <div className="flex justify-between items-center container">
        <div className="text-2xl font-bold flex gap-4">
          <Image
            src="/Jarno-Single-engine-Cessna.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            className="-scale-x-100"
            priority
          />
          <p className="hidden sm:flex">WingsInProgress</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              status === "authenticated" ? signOut() : signIn();
            }}
            variant={status === "authenticated" ? "outline" : "default"}
          >
            {status === "authenticated" ? "Logout" : "Login"}
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
