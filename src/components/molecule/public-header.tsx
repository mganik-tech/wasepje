import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Github, MoveRight } from "lucide-react";

function PublicHeader() {
  return (
    <header className="border-b bg-white">
      <nav
        className="mx-auto flex max-w-screen-xl items-center justify-center p-4 md:justify-between md:p-6 md:px-8"
        aria-label="Global"
      >
        <div className="flex md:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              width={40}
              height={40}
              className="h-10 w-10"
              src="/logo.png"
              alt="wasepje.com logo"
            />
            <p className="font-bold">WasepJe.com</p>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default PublicHeader;
