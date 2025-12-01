// src/services/alugueisService.ts
import { api } from './api';

export type AluguelDto = {
idAluguel: number;
dataRetirada: string;
dataPrevistaDevolucao: string;
dataDevolucaoReal: string | null;
quilometragemInicial: number;
quilometragemFinal: number | null;
valorDiaria: number;
valorTotal: number | null;
statusAluguel: string | null;
idCliente: number;
nomeCliente: string;
emailCliente: string;
idVeiculo: number;
modeloVeiculo: string;
placaVeiculo: string;
fabricanteVeiculo: string;
};

export type Aluguel = {
idAluguel: number;
dataRetirada: string;
dataPrevistaDevolucao: string;
dataDevolucaoReal: string | null;
quilometragemInicial: number;
quilometragemFinal: number | null;
valorDiaria: number;
valorTotal: number | null;
statusAluguel: string | null;
idCliente: number;
idVeiculo: number;
};

export type AluguelCreate = Omit<Aluguel, 'idAluguel'>;

export const alugueisService = {
getAll: () => api.get<AluguelDto[]>('/Alugueis'),

getById: (id: number) => api.get<AluguelDto>(`/Alugueis/${id}`),

create: (aluguel: AluguelCreate) => api.post<AluguelDto>('/Alugueis', aluguel),

update: (id: number, aluguel: AluguelCreate) => 
  api.put(`/Alugueis/${id}`, { ...aluguel, idAluguel: id }),

delete: (id: number) => api.delete(`/Alugueis/${id}`),

getAtivosPorCliente: (idCliente: number) => 
  api.get<AluguelDto[]>(`/Alugueis/ativos/cliente/${idCliente}`),

getPorPeriodo: (inicio: string, fim: string) => 
  api.get<AluguelDto[]>(`/Alugueis/periodo?inicio=${inicio}&fim=${fim}`),
};