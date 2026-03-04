import { Request, Response } from "express";

export default async function handler(
  req: Request,
  res: Response
) {
  await connectDB();
  return app(req, res);
}
