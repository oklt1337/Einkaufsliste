import { Schema, model, type HydratedDocument } from 'mongoose';

export interface ShoppingItem {
  name: string;
  bought: boolean;
  quantity: number;
  order: number;
  createdAt: Date;
}

const ShoppingItemSchema = new Schema<ShoppingItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    bought: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type ShoppingItemDocument = HydratedDocument<ShoppingItem>;

export const ShoppingItemModel = model<ShoppingItem>('ShoppingItem', ShoppingItemSchema);
