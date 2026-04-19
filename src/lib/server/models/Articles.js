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
		businessDescription: {
      type: String,
      required: true,
      trim: true
    },
    feedback: [{
    type: { type: String, enum: ['glow', 'grow'] },
    text: String,
    createdAt: { type: Date, default: Date.now }
    }]
	},
	{ timestamps: true }
);

export default mongoose.models.Article || mongoose.model('Article', articleSchema);