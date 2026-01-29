import mongoose, { Schema, Document, Types } from "mongoose";

export interface Record extends Document {
  dateOfDeparture: Date;
  dateOfArrival: Date;
  airCraft: {
    model: string;
    registration: string;
    engine: string;
  };
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  totalDuration: string;
  numberOfDayLandings: number;
  numberOfNightLandings: number;
  flightType: string[];
  exercises?: string;
  remark?: string;
  flownBy: Types.ObjectId;
}

const recordSchema: Schema<Record> = new Schema(
  {
    dateOfDeparture: {
      type: Date,
      required: true,
    },
    dateOfArrival: {
      type: Date,
      required: true,
    },
    airCraft: {
      model: {
        type: String,
        required: true,
        trim: true,
      },
      registration: {
        type: String,
        required: true,
        trim: true,
      },
      engine: {
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
      type: [String],
      required: true,
      trim: true,
    },
    exercises: {
      type: String,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    flownBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

recordSchema.index({ flownBy: 1, createdAt: -1 });

const RecordModel =
  (mongoose.models?.Record as mongoose.Model<Record>) ||
  mongoose.model<Record>("Record", recordSchema);

export default RecordModel;
