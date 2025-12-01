// src/services/veiculosService.ts
import { api } from './api';

export type VeiculoDto = {
idVeiculo: number;
modelo: string;
anoFabricacao: number;
quilometragemAtual: number;
placa: string;
cor: string | null;
disponivel: boolean;
fabricanteNome: string;
categoriaNome: string;
};

export type Veiculo = {
idVeiculo: number;
modelo: string;
anoFabricacao: number;
quilometragemAtual: number;
placa: string;
cor: string | null;
disponivel: boolean;
idFabricante: number;
idCategoria: number;
};

export type VeiculoCreate = Omit<Veiculo, 'idVeiculo'>;

export const veiculosService = {
getAll: () => api.get<VeiculoDto[]>('/Veiculos'),

getById: (id: number) => api.get<VeiculoDto>(`/Veiculos/${id}`),

create: (veiculo: VeiculoCreate) => api.post<Veiculo>('/Veiculos', veiculo),

update: (id: number, veiculo: VeiculoCreate) => 
  api.put(`/Veiculos/${id}`, { ...veiculo, idVeiculo: id }),

delete: (id: number) => api.delete(`/Veiculos/${id}`),

getDisponiveisPorCategoria: (idCategoria: number) => 
  api.get<VeiculoDto[]>(`/Veiculos/disponiveis/categoria/${idCategoria}`),

getAlugadosPorFabricante: (idFabricante: number) => 
  api.get<VeiculoDto[]>(`/Veiculos/alugados/fabricante/${idFabricante}`),
};