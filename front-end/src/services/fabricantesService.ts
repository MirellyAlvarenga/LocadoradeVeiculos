// src/services/fabricantesService.ts
import { api } from './api';

export type Fabricante = {
idFabricante: number;
nome: string;
paisOrigem: string | null;
};

export type FabricanteCreate = Omit<Fabricante, 'idFabricante'>;

export const fabricantesService = {
getAll: () => api.get<Fabricante[]>('/Fabricantes'),

getById: (id: number) => api.get<Fabricante>(`/Fabricantes/${id}`),

create: (fabricante: FabricanteCreate) => 
  api.post<Fabricante>('/Fabricantes', fabricante),

update: (id: number, fabricante: FabricanteCreate) => 
  api.put(`/Fabricantes/${id}`, { ...fabricante, idFabricante: id }),

delete: (id: number) => api.delete(`/Fabricantes/${id}`),
};