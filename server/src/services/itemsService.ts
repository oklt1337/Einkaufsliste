import { ShoppingItemModel } from '../models/ShoppingItem.js';
import type { ShoppingItemDocument } from '../models/ShoppingItem.js';

export const getItems = async (): Promise<ShoppingItemDocument[]> => {
  return ShoppingItemModel.find().sort({ order: 1, createdAt: -1 }).exec();
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const normalizeName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const createItem = async (name: string): Promise<ShoppingItemDocument> => {
  const normalized = normalizeName(name);
  const existing = await ShoppingItemModel.findOne({
    name: new RegExp(`^${escapeRegex(normalized)}$`, 'i'),
  }).exec();

  if (existing) {
    existing.name = normalizeName(existing.name);
    existing.quantity = (existing.quantity ?? 1) + 1;
    await existing.save();
    return existing;
  }

  const maxOrder = await ShoppingItemModel.findOne()
    .sort({ order: -1 })
    .select('order')
    .lean()
    .exec();
  const nextOrder = typeof maxOrder?.order === 'number' ? maxOrder.order + 1 : 0;

  return ShoppingItemModel.create({ name: normalized, order: nextOrder });
};

export const updateItem = async (
  id: string,
  updates: { bought?: boolean; quantity?: number; order?: number },
): Promise<ShoppingItemDocument | null> => {
  return ShoppingItemModel.findByIdAndUpdate(id, updates, { new: true }).exec();
};

export const deleteItem = async (id: string): Promise<ShoppingItemDocument | null> => {
  return ShoppingItemModel.findByIdAndDelete(id).exec();
};
