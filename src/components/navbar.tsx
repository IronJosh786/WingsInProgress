"use client";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { DropdownMenuComponent } from "./drop-down-menu";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="sticky top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30 py-3">
      <div className="flex justify-between items-center container px-1 xs:px-4">
        <div
          onClick={() => router.push("/")}
          className="text-2xl font-bold flex gap-4 hover:cursor-pointer"
        >
          <img
            src="/Jarno-Single-engine-Cessna.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            className="-scale-x-100 -rotate-12"
          />
          <p className="hidden sm:flex">WingsInProgress</p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {status === "authenticated" ? (
            <DropdownMenuComponent />
          ) : (
            <Button onClick={() => signIn()}>Login</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
