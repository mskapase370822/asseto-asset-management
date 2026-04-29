import mongoose from 'mongoose';

const slackConfigurationSchema = new mongoose.Schema(
  {
    slack_user_id: { type: String },
    access_token: { type: String },
    team_id: { type: String },
    channel_id: { type: String },
    client_id: { type: String },
    client_secret: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

const SlackConfiguration = mongoose.model('SlackConfiguration', slackConfigurationSchema);
export default SlackConfiguration;
