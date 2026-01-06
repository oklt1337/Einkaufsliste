import { ListSettingsModel } from '../models/ListSettings.js';
import type { ListSettingsDocument } from '../models/ListSettings.js';

export const getListSettings = async (): Promise<ListSettingsDocument> => {
  const defaultTitle = process.env.DEFAULT_LIST_TITLE ?? 'Was brauchst du heute?';
  const existing = await ListSettingsModel.findOne().exec();
  if (existing) {
    return existing;
  }
  return ListSettingsModel.create({ title: defaultTitle });
};

export const updateListTitle = async (title: string): Promise<ListSettingsDocument> => {
  const updated = await ListSettingsModel.findOneAndUpdate(
    {},
    { title },
    { new: true, upsert: true },
  ).exec();

  if (!updated) {
    return ListSettingsModel.create({ title });
  }

  return updated;
};
