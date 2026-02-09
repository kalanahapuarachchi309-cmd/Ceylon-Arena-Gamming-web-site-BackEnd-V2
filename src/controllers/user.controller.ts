import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User";

const ACCESS_TOKEN_EXPIRE = "15m";
const REFRESH_TOKEN_EXPIRE = "7d";

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { playerName, email, phone, promoCode, leaderAddress, password, game, gameId, teamName, player2Name, player2Id, player3Name, player3Id, player4Name, player4Id } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      playerName,
      email,
      phone,
      promoCode,
      address: leaderAddress,
      password: hashedPassword,
      games: [{ game, gameId, teamName, player2Name, player2Id, player3Name, player3Id, player4Name, player4Id }]
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRE });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRE });

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        playerName: user.playerName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Use jwt.verify synchronously and type the payload
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    } catch (err) {
      return res.status(403).json({ message: "Token expired or invalid" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
