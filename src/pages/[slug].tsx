import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { UAParser } from "ua-parser-js";

import ClickableLogo from "@/components/molecule/clickable-logo";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { api } from "@/utils/api";
import { useSearchParams } from "next/navigation";

export const getServerSideProps = (async (ctx) => {
  const slug = String(ctx.params?.slug);
  const link = await db.link.findFirst({
    where: { slug },
    include: { phones: true },
  });

  if (!link) {
    return { props: { plan: "free" } };
  }

  return {
    props: {
      plan: "pro",
      link: { id: link.id, message: link.message },
      nextPhone: link.phones.at(link.nextPhone)?.number,
    },
  };

  //
}) satisfies GetServerSideProps<{
  plan: "free" | "pro";
  link?: { id: string; message: string | null };
  nextPhone?: string;
}>;

function RedirectPage({
  plan,
  link,
  nextPhone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [countdown, setCountdown] = useState(2);
  // const hasEnded = countdown === 0;

  const updateNextPhone = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      if (countdown > 0) setCountdown(countdown - 1);
    }, 1000);

    // Set timeout to click the button after 3 seconds
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, countdown * 1000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(timer);
    };
  }, [countdown]);

  // pro redirect
  useEffect(() => {
    if (link && plan === "pro") {
      redirect({ link, plan: "pro" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link, plan]);

  const redirect = ({
    plan,
    link,
  }: {
    plan: "free" | "pro";
    link: { id: string; message: string | null };
  }) => {
    const searchParams = new URLSearchParams(window.location.search);
    const text = searchParams.get("text") ?? "";
    const inboundId = searchParams.get("inboundId") ?? "";

    // Replace variables in the message
    let parsedMessage = link.message ?? "";
    parsedMessage = parsedMessage
      .replace(/\$\{text\}/g, text)
      .replace(/\$\{inboundId\}/g, inboundId);

    // Build WhatsApp URL
    let url = `https://wa.me/${nextPhone}`;
    if (parsedMessage) {
      url += `?text=${encodeURIComponent(parsedMessage)}`;
    }

    const ua = UAParser(window.navigator.userAgent);
    const metadata = {
      browser: ua?.browser.name ?? "(unknown)",
      country: "(unknown)",
      continent: "(unknown)",
      device: ua?.device.type ?? "Desktop",
      os: ua?.os.name ?? "(unknown)",
      referrer: document.referrer || "(direct)",
    };

    updateNextPhone.mutate({ id: link.id, metadata });

    void router.push(url);

    if (plan === "free") {
      const popUnder = window.open("https://go.wasepje.com/shopee", "_blank");
      if (popUnder) window.focus();
    }
  };

  if (!link && !nextPhone) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl">404</h1>
        <p className="">
          Link not found. Go{" "}
          <Link
            href="/"
            className="font-medium text-gray-700 underline hover:text-black"
          >
            back home
          </Link>
          .
        </p>
        <div className="fixed bottom-0 mx-auto p-8">
          <ClickableLogo />
        </div>
      </main>
    );
  }

  return null;
}

export default RedirectPage;
