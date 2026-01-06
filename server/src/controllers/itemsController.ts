import { isValidObjectId } from 'mongoose';
import type { RequestHandler } from 'express';
import type { ShoppingItemDTO } from '../../shared/src/dto.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { createItemSchema, updateItemSchema } from '../validation/items.js';
import { createItem, deleteItem, getItems, updateItem } from '../services/itemsService.js';

const formatName = (value: string): string => {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const mapToDTO = (item: {
  _id: unknown;
  name: string;
  bought: boolean;
  quantity: number;
  order?: number;
  createdAt: Date;
}): ShoppingItemDTO => {
  return {
    id: String(item._id),
    name: formatName(item.name),
    bought: item.bought,
    quantity: item.quantity ?? 1,
    order: item.order ?? 0,
    createdAt: item.createdAt.toISOString(),
  };
};

export const listItems: RequestHandler = asyncHandler(async (_req, res) => {
  const items = await getItems();
  res.status(200).json(items.map(mapToDTO));
});

export const addItem: RequestHandler = asyncHandler(async (req, res) => {
  const { name } = createItemSchema.parse(req.body);
  const item = await createItem(name);
  res.status(201).json(mapToDTO(item));
});

export const updateItemStatus: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError(400, 'Invalid id');
  }

  const { bought, quantity, order } = updateItemSchema.parse(req.body);

  if (quantity === 0) {
    const deleted = await deleteItem(id);
    if (!deleted) {
      throw new AppError(404, 'Item not found');
    }
    res.status(204).send();
    return;
  }

  const updated = await updateItem(id, { bought, quantity, order });
  if (!updated) {
    throw new AppError(404, 'Item not found');
  }

  res.status(200).json(mapToDTO(updated));
});

export const removeItem: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError(400, 'Invalid id');
  }

  const deleted = await deleteItem(id);
  if (!deleted) {
    throw new AppError(404, 'Item not found');
  }

  res.status(204).send();
});
