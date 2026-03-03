import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
	{
		businessName: {
      type: String,
      required: true,
      trim: true
    },
		businessType: {
      type: String,
      required: true,
      trim: true
    },
		businessRating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    }
	},
	{ timestamps: true }
);

export default mongoose.models.Article || mongoose.model('Article', articleSchema);