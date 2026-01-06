export interface ShoppingItemDTO {
  id: string;
  name: string;
  bought: boolean;
  quantity: number;
  order: number;
  createdAt: string;
}

export interface CreateItemRequest {
  name: string;
}

export interface UpdateItemRequest {
  bought?: boolean;
  quantity?: number;
  order?: number;
}

export interface ListSettingsDTO {
  id: string;
  title: string;
  createdAt: string;
}

export interface UpdateListTitleRequest {
  title: string;
}
