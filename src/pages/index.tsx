import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BackgroundPlayer from "next-video/background-player";

import Footer from "@/components/molecule/footer";

import SEOHead from "@/components/molecule/seo-head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [openItem, setOpenItem] = useState("1");
  const onValueChange = (value: string) => setOpenItem(value);

  return (
    <div className="">
      <SEOHead
        title="WhatsApp Link Rotator | WasepJe.com"
        description="Open-Source WhatsApp Link Rotator, an alternative to wasap.my"
        path="/"
        ogPath="/og.png"
      />
      <header className="w-full border-b bg-white">
        <nav
          className="mx-auto flex max-w-screen-xl items-center justify-between p-4 sm:p-6 sm:px-8"
          aria-label="Global"
        >
          <div className="flex sm:flex-1">
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
          <Button size="sm" variant="ghost" asChild>
            <Link href="/dashboard/links">Dashboard Links</Link>
          </Button>
        </nav>
      </header>

      {/* hero */}
      <div className="mx-auto max-w-screen-xl border-b py-16 lg:flex lg:flex-col lg:items-center">
        <div className="mx-auto max-w-screen-xl px-4 text-center lg:mx-0 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            One link, multiple numbers. Simple as that.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            wasep je, the open-source whatsapp link rotator, wasap.my
            alternative.
          </p>
        </div>
        <div className="mt-16 flex w-full items-center justify-center px-2">
          <Image
            priority
            width={1000}
            height={1000}
            src="/diagram.svg"
            className="w-full max-w-screen-md"
            alt="wasepje redirection visualization"
          />
        </div>
      </div>

      {/* create links */}
      <div className="flex w-full flex-col bg-white px-8 py-10 md:py-16">
        <div className="mx-auto mt-8 w-full max-w-screen-lg">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex w-full flex-col justify-center">
              <h3 className="text-3xl font-black">
                Multiple numbers in one link
              </h3>
              <Accordion
                type="single"
                value={openItem}
                onValueChange={onValueChange}
                className="mt-4"
              >
                <AccordionItem value="1">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Choose a unique link slug
                  </AccordionTrigger>
                  <AccordionContent>
                    Start by creating a unique link with a custom slug that
                    makes it easy to share and remember.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Write a pre-filled text
                  </AccordionTrigger>
                  <AccordionContent>
                    Optionally, write a prefilled text that users will see when
                    they click the link, making communication faster and more
                    convenient.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                  <AccordionTrigger className="font-bold hover:no-underline">
                    Add phone numbers
                  </AccordionTrigger>
                  <AccordionContent>
                    Add all the phone numbers you want to connect to the link,
                    allowing customers to reach you on multiple numbers with a
                    single click.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/dashboard/links">Create my link now!</Link>
                </Button>
              </div>
            </div>
            <div className="w-full">
              <BackgroundPlayer
                src="/videos/link-demo.mp4"
                className="mx-auto max-w-sm overflow-hidden rounded-xl border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* generate QR code */}
      <div className="w-full border-y bg-zinc-50 px-8 py-10 md:py-16">
        <div className="flex w-full flex-col-reverse gap-6 md:flex-row">
          <div className="w-full">
            <BackgroundPlayer
              src="/videos/qr-demo.mp4"
              className="mx-auto max-w-sm overflow-hidden rounded-xl border"
            />
          </div>
          <div className="flex w-full flex-col justify-center">
            <h3 className="max-w-lg text-3xl font-black">
              QR Codes tailored to your brand!
            </h3>
            <p className="mt-4 max-w-lg">
              Turn your custom link into a QR code with a single click. Perfect
              for quick sharing and easy customer access!
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/dashboard/links">Generate QR Code</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* link weigtage */}
      <div className="w-full bg-white px-8 py-10 md:py-16">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col justify-center">
            <h3 className="max-w-lg text-3xl font-black">
              Set phone number weightage
            </h3>
            <p className="mt-4 max-w-lg">
              Decide which number gets priority. Duplicate it as many times as
              you need for better visibility.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/dashboard/links">Get Started Now</Link>
              </Button>
            </div>
          </div>
          <div className="w-full">
            <BackgroundPlayer
              src="/videos/weightage-demo.mp4"
              className="mx-auto max-w-sm overflow-hidden rounded-xl border"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
