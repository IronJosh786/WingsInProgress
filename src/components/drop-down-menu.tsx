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
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <DropdownMenuItem onClick={() => router.push("/home")}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/new-record")}>
            New Record
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/all-record")}>
            All Record
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
