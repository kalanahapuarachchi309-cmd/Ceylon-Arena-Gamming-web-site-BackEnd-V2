import { Request, Response } from "express";
import connectDB from "../config/db";
import app from "../app";

export default async function handler(
  req: Request,
  res: Response
) {
  await connectDB();
  return app(req, res);
}
