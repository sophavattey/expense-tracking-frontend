export interface Category {
  id: string;                           
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isOwned: boolean;
}

export interface CategoryRequest {
  name: string;
  icon?: string;
  color?: string;
}