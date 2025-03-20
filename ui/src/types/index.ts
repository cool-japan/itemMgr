export interface Item {
  ItemId: number;
  ItemName: string;
  Company: string;
  DateOfJoining: string;
  Abstract: string;
  Price: number;
  PhotoFileName: string;
  Category?: number | null;
  category_name?: string;
}

export interface Company {
  CompanyId: number;
  CompanyName: string;
}

export interface Category {
  CategoryId: number;
  CategoryName: string;
  Description: string;
}

export interface User {
  id?: number;
  username: string;
  email?: string;
  password?: string;
  token?: string;
}

export interface FormErrors {
  [key: string]: string;
}