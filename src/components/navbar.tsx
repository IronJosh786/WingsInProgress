"use client";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSession, signIn } from "next-auth/react";
import { DropdownMenuComponent } from "./drop-down-menu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || status === "authenticated") {
      return;
    }
    if (!session) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  return (
    <div className="sticky top-0 z-10 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:bg-gray-200 lg:dark:bg-zinc-800/30 py-3">
      <div className="flex justify-between items-center container px-1 xs:px-4">
        <div
          onClick={() => router.push("/")}
          className="text-2xl font-bold flex gap-4 hover:cursor-pointer"
        >
          <Image
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
            <Button
              disabled={status === "loading"}
              className="disabled:bg-gray-400"
              onClick={() => signIn()}
            >
              {status === "loading" ? "Processing" : "Login"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
