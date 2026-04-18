import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export type TransactionType = 0 | 1;

export const TransactionTypes = {
  Income: 0 as TransactionType,
  Expense: 1 as TransactionType
};

export interface Transaction {
  id: number;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: number;
  category?: Category;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface TransactionQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  type?: TransactionType;
  categoryId?: number;
}

export const getTransactions = async (params: {
  page: number;
  pageSize: number;
  search: string;
  categoryId: unknown;
  sortBy: string;
  order: string;
  type: any;
  startDate: any;
  endDate: any
}): Promise<PagedResult<Transaction>> => {
  const response = await api.get<PagedResult<Transaction>>('/transactions', { params });
  return response.data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction>(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (values: any) => {
  const response = await api.post('/transactions', {
    Title: values.title,
    Description: values.description,
    Amount: values.amount,
    Date: values.date?.toISOString(),
    Type: values.type,
    CategoryId: values.categoryId
  });

  return response.data;
};

export const updateTransaction = async (id: number, values: any) => {
  const response = await api.put(`/transactions/${id}`, {
    Title: values.title,
    Description: values.description,
    Amount: values.amount,
    Date: values.date?.toISOString(),
    Type: values.type,
    CategoryId: values.categoryId
  });

  return response.data;
};

export const deleteTransaction = async (id: number) => {
  await api.delete(`/transactions/${id}`);
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getAnalytics = async (start: string, end: string) => {
  const response = await api.get('/transactions/analytics', { params: { start, end } });
  return response.data;
};

export default api;
