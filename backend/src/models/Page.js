const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['heading', 'text', 'button'], required: true },
    props: { type: Object, default: {} },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    widgets: { type: [WidgetSchema], default: [] },
    style: { type: Object, default: {} },
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sections: { type: [SectionSchema], default: [] },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', PageSchema);

