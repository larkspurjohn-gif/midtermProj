import mongoose from 'mongoose';

const timeRangeSchema = new mongoose.Schema({
 open: { 
    type: String, 
    required: true,
    match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Use HH:mm format'] 
  },
  close: { 
    type: String, 
    required: true,
    match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Use HH:mm format'] 
  }
}, { _id: false });

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
    businessOwner: {
      type: String,
      required: true,
      trim: true
    },
    businessHours: {
      monday: [timeRangeSchema],
      tuesday: [timeRangeSchema],
      wednesday: [timeRangeSchema],
      thursday: [timeRangeSchema],
      friday: [timeRangeSchema],
      saturday: [timeRangeSchema],
      sunday: [timeRangeSchema]
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