import mongoose from 'mongoose';
import moment from 'moment';
import validator from 'validator';

const NotificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent'],
      default: 'pending',
    },

    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
