import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./UserMenu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <nav className="px-12 py-4 flex justify-between items-center border-b-2 shadow-md">
      <Link href="/">
        <Image src="/video.png" alt="logo" height={30} width={40} />
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/events?create=true">
          <Button className="flex items-center gap-2">
            <PenBox /> Create Event
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button asChild variant="outline">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
