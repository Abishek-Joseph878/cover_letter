import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoverLetter extends Document {
  title: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  resumeText?: string;
  generatedContent: string;
  tone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    resumeText: {
      type: String,
      trim: true,
    },
    generatedContent: {
      type: String,
      required: [true, "Generated content is required"],
    },
    tone: {
      type: String,
      trim: true,
      default: "Professional",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model multiple times during Next.js hot reloads
const CoverLetter: Model<ICoverLetter> =
  mongoose.models.CoverLetter ||
  mongoose.model<ICoverLetter>("CoverLetter", CoverLetterSchema);

export default CoverLetter;
