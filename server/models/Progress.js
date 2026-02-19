import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 40,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
