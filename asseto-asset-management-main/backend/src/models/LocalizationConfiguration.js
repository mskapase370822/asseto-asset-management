import mongoose from 'mongoose';

const localizationConfigurationSchema = new mongoose.Schema(
  {
    date_format: { type: String, default: 'MM/DD/YYYY' },
    time_format: { type: String, default: '12h' },
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    name_display_format: { type: String },
    country_format: { type: String },
    default_language: { type: String, default: 'en' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

const LocalizationConfiguration = mongoose.model(
  'LocalizationConfiguration',
  localizationConfigurationSchema
);
export default LocalizationConfiguration;
