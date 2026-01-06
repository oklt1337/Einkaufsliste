import type { ListSettingsDTO, UpdateListTitleRequest } from '../../../shared/src/dto';
import { apiFetch } from './client';

export const getListTitle = async (): Promise<ListSettingsDTO> => {
  return apiFetch<ListSettingsDTO>('/list');
};

export const updateListTitle = async (
  payload: UpdateListTitleRequest,
): Promise<ListSettingsDTO> => {
  return apiFetch<ListSettingsDTO>('/list', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};
