// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: string;
}

export default function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const caller = appRouter.createCaller({ db });

    res.status(200).json({ plan: "pro" });
  }

  res.status(405);
}
