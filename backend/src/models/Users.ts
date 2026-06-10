import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  auth0Id: string;
  name: string; // add name field
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // add name field
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
