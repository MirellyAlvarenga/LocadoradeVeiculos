// src/services/clientesService.ts
import { api } from './api';

export type Cliente = {
idCliente: number;
nome: string;
cpf: string;
email: string;
telefone: string | null;
dataNascimento: string;
};

export type ClienteCreate = Omit<Cliente, 'idCliente'>;

export const clientesService = {
getAll: () => api.get<Cliente[]>('/Clientes'),

getById: (id: number) => api.get<Cliente>(`/Clientes/${id}`),

create: (cliente: ClienteCreate) => api.post<Cliente>('/Clientes', cliente),

update: (id: number, cliente: ClienteCreate) => 
  api.put(`/Clientes/${id}`, { ...cliente, idCliente: id }),

delete: (id: number) => api.delete(`/Clientes/${id}`),
};