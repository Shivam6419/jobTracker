import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  jobRole: { type: String, required: true, trim: true },
  location: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Interview", "Selected", "Rejected"], default: "Applied" },
  appliedDate: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
