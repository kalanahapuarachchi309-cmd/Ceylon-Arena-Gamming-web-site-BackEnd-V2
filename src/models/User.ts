import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  USER = "USER", ADMIN = "ADMIN"
}

export interface IGame {
  game: string;
  gameId: string;
  teamName: string;
  player2Name: string;
  player2Id: string;
  player3Name: string;
  player3Id: string;
  player4Name: string;
  player4Id: string;
}

export interface IUser extends Document {
  playerName: string;
  role: string;
  email: string;
  phone: string;
  promoCode?: string;
  address: string;
  password: string;
  games: IGame[];
  refreshToken: string;
}

const GameSchema = new Schema<IGame>(
  {
    game: String,
    gameId: String,
    teamName: String,
    player2Name: String,
    player2Id: String,
    player3Name: String,
    player3Id: String,
    player4Name: String,
    player4Id: String
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    playerName: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    promoCode: { type: String, required: false },
    address: { type: String, required: true },
    password: { type: String, required: true },
    games: [GameSchema],
    refreshToken: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
