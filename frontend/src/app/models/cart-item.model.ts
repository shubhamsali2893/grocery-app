import { GroceryItem } from './grocery-item.model';

export interface CartItem {
  id: number;
  groceryItem: GroceryItem;
  quantity: number;
  sessionId: string;
  totalPrice: number;
}
