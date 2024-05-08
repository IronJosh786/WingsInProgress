import mongoose, { Schema, Document, Types } from "mongoose";

export interface Record extends Document {
  dateOfDeparture: Date;
  airCraft: {
    name: string;
    model: string;
  };
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  totalDuration: string;
  numberOfDayLandings: number;
  numberOfNightLandings: number;
  flightType: string;
  remark?: string;
  flownBy: Types.ObjectId;
}

const recordSchema: Schema<Record> = new Schema(
  {
    dateOfDeparture: {
      type: Date,
      required: true,
    },
    airCraft: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    totalDuration: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfDayLandings: {
      type: Number,
      required: true,
    },
    numberOfNightLandings: {
      type: Number,
      required: true,
    },
    flightType: {
      type: String,
      required: true,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    flownBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

const RecordModel =
  (mongoose.models?.Record as mongoose.Model<Record>) ||
  mongoose.model<Record>("Record", recordSchema);

export default RecordModel;
