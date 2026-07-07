export interface IService {
  title: string;
  description?: string;
  price: number;
  duration?: number;
  categoryId: string;
}

export interface IServiceUpdate {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
}
