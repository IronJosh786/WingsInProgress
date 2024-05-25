import Link from "next/link";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Home, LayoutList, LogOut, SquarePen } from "lucide-react";

export function DropdownMenuComponent() {
  const { data: session, status } = useSession();
  let profilePicture = session?.user?.profilePicture;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    } else if (status === "authenticated") {
      profilePicture = session?.user?.profilePicture;
      return;
    } else {
      router.push("/");
      return;
    }
  }, [session, status]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link
          href={"#"}
          className="flex gap-2 items-center hover:cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={profilePicture} alt="profile picture" />
            <AvatarFallback>
              {session?.user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown />
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/home"} className="flex items-center gap-2">
              <Home size={"16px"} />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/new-record"} className="flex items-center gap-2">
              <SquarePen size={"16px"} />
              New Record
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/all-record"} className="flex items-center gap-2">
              <LayoutList size={"16px"} />
              All Records
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut size={"16px"} /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
