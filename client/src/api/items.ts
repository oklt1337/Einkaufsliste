import type {
  CreateItemRequest,
  ShoppingItemDTO,
  UpdateItemRequest,
} from '../../../shared/src/dto';
import { apiFetch } from './client';

export const getItems = async (): Promise<ShoppingItemDTO[]> => {
  return apiFetch<ShoppingItemDTO[]>('/items');
};

export const createItem = async (payload: CreateItemRequest): Promise<ShoppingItemDTO> => {
  return apiFetch<ShoppingItemDTO>('/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateItem = async (
  id: string,
  payload: UpdateItemRequest,
): Promise<ShoppingItemDTO | null> => {
  const response = await apiFetch<ShoppingItemDTO | undefined>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response ?? null;
};

export const deleteItem = async (id: string): Promise<void> => {
  await apiFetch<void>(`/items/${id}`, {
    method: 'DELETE',
  });
};
