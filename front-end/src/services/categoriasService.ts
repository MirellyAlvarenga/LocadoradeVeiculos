// src/services/categoriasService.ts
import { api } from './api';

export type CategoriaVeiculo = {
idCategoria: number;
nome: string;
descricao: string | null;
valorDiariaBase: number;
};

export type CategoriaCreate = Omit<CategoriaVeiculo, 'idCategoria'>;

export const categoriasService = {
getAll: () => api.get<CategoriaVeiculo[]>('/CategoriasVeiculo'),

getById: (id: number) => api.get<CategoriaVeiculo>(`/CategoriasVeiculo/${id}`),

create: (categoria: CategoriaCreate) => 
  api.post<CategoriaVeiculo>('/CategoriasVeiculo', categoria),

update: (id: number, categoria: CategoriaCreate) => 
  api.put(`/CategoriasVeiculo/${id}`, { ...categoria, idCategoria: id }),

delete: (id: number) => api.delete(`/CategoriasVeiculo/${id}`),
};