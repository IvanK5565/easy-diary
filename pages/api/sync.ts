import container from "@/server/di/container";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse){
  container.resolve('db').sync();
  res.status(200).send('sync')
}