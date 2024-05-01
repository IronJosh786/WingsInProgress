import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  email: string;
  name: string;
  profilePicture?: string;
  username?: string;
}

const userSchema: Schema<User> = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  },
});

const UserModel =
  (mongoose.models?.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
