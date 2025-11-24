/* eslint-disable no-constant-binary-expression */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import container from "@/server/di/container";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const db = container.resolve("db");
    await db.authenticate();
    // await db.sync({force: true});

    res.status(200).json({
      test: new Date(Date.UTC(2025, 6, 21)) === new Date(Date.UTC(2025, 6, 21)),
    });
  } catch (error) {
    res.status(500).json({ test: "false", error });
  }
}
