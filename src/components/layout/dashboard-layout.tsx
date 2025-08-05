import Link from "next/link";
import { useRouter } from "next/router";

import { Home, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ClickableLogo from "../molecule/clickable-logo";

const links = [
  {
    title: "Links",
    href: "/dashboard/links",
    Icon: Home,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden h-screen border-r bg-muted/40 md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4">
            <ClickableLogo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start space-y-2 px-2 text-sm font-medium md:px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={router.pathname.startsWith(link.href)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary data-[active=true]:bg-gray-200 data-[active=true]:text-primary"
                >
                  <link.Icon className="h-4 w-4" />
                  <span>{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex h-screen flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-muted/40 p-4 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-4">
              <nav className="grid gap-2 text-sm font-medium">
                <ClickableLogo />
                <div className="mt-4 flex flex-col space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      data-active={router.pathname.startsWith(link.href)}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-primary"
                    >
                      <link.Icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col overflow-scroll p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
