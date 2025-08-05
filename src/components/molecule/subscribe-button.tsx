import Link from "next/link";
import React, { useState } from "react";

import { env } from "@/env.mjs";
import { Button } from "../ui/button";

function SubscribeButton({
  children,
  className,
  billing,
}: {
  className?: string;
  billing: "monthly" | "annually";
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className={className}
      loading={loading}
      onClick={() => setLoading(true)}
      asChild
    >
      {children}
    </Button>
  );
}

export default SubscribeButton;
