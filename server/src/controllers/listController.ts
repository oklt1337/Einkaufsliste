import type { RequestHandler } from 'express';
import type { ListSettingsDTO } from '../../shared/src/dto.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { updateListTitleSchema } from '../validation/list.js';
import { getListSettings, updateListTitle } from '../services/listService.js';

const mapToDTO = (settings: { _id: unknown; title: string; createdAt: Date }): ListSettingsDTO => {
  return {
    id: String(settings._id),
    title: settings.title,
    createdAt: settings.createdAt.toISOString(),
  };
};

export const getList: RequestHandler = asyncHandler(async (_req, res) => {
  const settings = await getListSettings();
  res.status(200).json(mapToDTO(settings));
});

export const updateList: RequestHandler = asyncHandler(async (req, res) => {
  const { title } = updateListTitleSchema.parse(req.body);
  const settings = await updateListTitle(title);
  res.status(200).json(mapToDTO(settings));
});
