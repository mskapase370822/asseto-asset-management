import mongoose from 'mongoose';

const tagConfigurationSchema = new mongoose.Schema(
  {
    prefix: { type: String, default: 'ASSET' },
    number_suffix: { type: Number, default: 1000 },
    use_default_settings: { type: Boolean, default: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

const TagConfiguration = mongoose.model('TagConfiguration', tagConfigurationSchema);
export default TagConfiguration;
