import { Schema, model, type HydratedDocument } from 'mongoose';

export interface ListSettings {
  title: string;
  createdAt: Date;
}

const ListSettingsSchema = new Schema<ListSettings>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type ListSettingsDocument = HydratedDocument<ListSettings>;

export const ListSettingsModel = model<ListSettings>('ListSettings', ListSettingsSchema);
