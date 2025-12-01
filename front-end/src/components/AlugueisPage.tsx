import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from './ui/table';
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter,
} from './ui/dialog';
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
} from './ui/alert-dialog';
import { Label } from './ui/label';
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { alugueisService, AluguelDto, AluguelCreate } from '../services/alugueisService';
import { clientesService, Cliente } from '../services/clientesService';
import { veiculosService, VeiculoDto } from '../services/veiculosService';

export function AlugueisPage() {
const [alugueis, setAlugueis] = useState<AluguelDto[]>([]);
const [clientes, setClientes] = useState<Cliente[]>([]);
const [veiculos, setVeiculos] = useState<VeiculoDto[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<string>('todos');
const [dialogOpen, setDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [editingAluguel, setEditingAluguel] = useState<AluguelDto | null>(null);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<AluguelCreate>({
  dataRetirada: '',
  dataPrevistaDevolucao: '',
  dataDevolucaoReal: null,
  quilometragemInicial: 0,
  quilometragemFinal: null,
  valorDiaria: 0,
  valorTotal: null,
  statusAluguel: 'Ativo',
  idCliente: 0,
  idVeiculo: 0,
});

// Filtros de período
const [dataInicio, setDataInicio] = useState('');
const [dataFim, setDataFim] = useState('');

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const [alugueisData, clientesData, veiculosData] = await Promise.all([
      alugueisService.getAll(),
      clientesService.getAll(),
      veiculosService.getAll(),
    ]);
    setAlugueis(alugueisData);
    setClientes(clientesData);
    setVeiculos(veiculosData);
  } catch (err) {
    setError('Erro ao carregar dados');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const loadAluguelsPorPeriodo = async () => {
  if (!dataInicio || !dataFim) {
    alert('Selecione um período válido');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    const data = await alugueisService.getPorPeriodo(dataInicio, dataFim);
    setAlugueis(data);
  } catch (err) {
    setError('Erro ao filtrar aluguéis por período');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredAlugueis = alugueis.filter((aluguel) => {
  const matchesSearch =
    aluguel.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluguel.emailCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluguel.modeloVeiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluguel.placaVeiculo.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesStatus =
    statusFilter === 'todos' ||
    (aluguel.statusAluguel?.toLowerCase() === statusFilter.toLowerCase());
  
  return matchesSearch && matchesStatus;
});

const handleOpenDialog = (aluguel?: AluguelDto) => {
  if (aluguel) {
    setEditingAluguel(aluguel);
    setFormData({
      dataRetirada: aluguel.dataRetirada.split('T')[0],
      dataPrevistaDevolucao: aluguel.dataPrevistaDevolucao.split('T')[0],
      dataDevolucaoReal: aluguel.dataDevolucaoReal ? aluguel.dataDevolucaoReal.split('T')[0] : null,
      quilometragemInicial: aluguel.quilometragemInicial,
      quilometragemFinal: aluguel.quilometragemFinal,
      valorDiaria: aluguel.valorDiaria,
      valorTotal: aluguel.valorTotal,
      statusAluguel: aluguel.statusAluguel || 'Ativo',
      idCliente: aluguel.idCliente,
      idVeiculo: aluguel.idVeiculo,
    });
  } else {
    setEditingAluguel(null);
    const hoje = new Date().toISOString().split('T')[0];
    setFormData({
      dataRetirada: hoje,
      dataPrevistaDevolucao: hoje,
      dataDevolucaoReal: null,
      quilometragemInicial: 0,
      quilometragemFinal: null,
      valorDiaria: 0,
      valorTotal: null,
      statusAluguel: 'Ativo',
      idCliente: 0,
      idVeiculo: 0,
    });
  }
  setDialogOpen(true);
};

const calculateValorTotal = () => {
  const dataRetirada = new Date(formData.dataRetirada);
  const dataPrevista = new Date(formData.dataPrevistaDevolucao);
  const dias = Math.ceil((dataPrevista.getTime() - dataRetirada.getTime()) / (1000 * 3600 * 24));
  return dias > 0 ? dias * formData.valorDiaria : 0;
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);

    // Calcular valor total
    const valorTotal = calculateValorTotal();
    const dataToSave = { ...formData, valorTotal };

    if (editingAluguel) {
      await alugueisService.update(editingAluguel.idAluguel, dataToSave);
    } else {
      await alugueisService.create(dataToSave);
    }

    await loadData();
    setDialogOpen(false);
  } catch (err) {
    setError('Erro ao salvar aluguel');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  if (deletingId) {
    try {
      setLoading(true);
      setError(null);
      await alugueisService.delete(deletingId);
      await loadData();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Erro ao excluir aluguel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
};

const openDeleteDialog = (id: number) => {
  setDeletingId(id);
  setDeleteDialogOpen(true);
};

const getStatusBadge = (status: string | null) => {
  if (!status) return <Badge className="bg-gray-500">-</Badge>;
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'ativo') {
    return <Badge className="bg-green-500">Ativo</Badge>;
  } else if (statusLower === 'finalizado') {
    return <Badge className="bg-blue-500">Finalizado</Badge>;
  } else if (statusLower === 'cancelado') {
    return <Badge className="bg-red-500">Cancelado</Badge>;
  }
  return <Badge className="bg-gray-500">{status}</Badge>;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number | null) => {
  if (value === null) return '-';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

if (loading && alugueis.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl">Aluguéis</h2>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Aluguel
      </Button>
    </div>

    {error && (
      <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    {/* Filtros */}
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente ou veículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Status</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="finalizado">Finalizado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Filtro por Período */}
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Filtrar por Período
      </h3>
      <div className="flex gap-4 items-end">
        <div className="grid gap-2">
          <Label htmlFor="dataInicio">Data Início</Label>
          <Input
            id="dataInicio"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dataFim">Data Fim</Label>
          <Input
            id="dataFim"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <Button onClick={loadAluguelsPorPeriodo} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Filtrar
        </Button>
        <Button variant="outline" onClick={loadData} disabled={loading}>
          Limpar Filtro
        </Button>
      </div>
    </div>

    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Data Retirada</TableHead>
            <TableHead>Data Prev. Devolução</TableHead>
            <TableHead>Data Devolução Real</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAlugueis.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Nenhum aluguel encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredAlugueis.map((aluguel) => (
              <TableRow key={aluguel.idAluguel}>
                <TableCell>{aluguel.nomeCliente}</TableCell>
                <TableCell>{aluguel.modeloVeiculo}</TableCell>
                <TableCell>{aluguel.placaVeiculo}</TableCell>
                <TableCell>{formatDate(aluguel.dataRetirada)}</TableCell>
                <TableCell>{formatDate(aluguel.dataPrevistaDevolucao)}</TableCell>
                <TableCell>
                  {aluguel.dataDevolucaoReal ? formatDate(aluguel.dataDevolucaoReal) : '-'}
                </TableCell>
                <TableCell>{formatCurrency(aluguel.valorTotal)}</TableCell>
                <TableCell>{getStatusBadge(aluguel.statusAluguel)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(aluguel)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(aluguel.idAluguel)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    {/* Dialog de Cadastro/Edição */}
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAluguel ? 'Editar Aluguel' : 'Novo Aluguel'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select
              value={formData.idCliente.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, idCliente: parseInt(value) })
              }
            >
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                    {cliente.nome} - {cliente.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="veiculo">Veículo *</Label>
            <Select
              value={formData.idVeiculo.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, idVeiculo: parseInt(value) })
              }
            >
              <SelectTrigger id="veiculo">
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {veiculos
                  .filter(v => v.disponivel || editingAluguel?.idVeiculo === v.idVeiculo)
                  .map((veiculo) => (
                    <SelectItem key={veiculo.idVeiculo} value={veiculo.idVeiculo.toString()}>
                      {veiculo.modelo} - {veiculo.placa} ({veiculo.fabricanteNome})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dataRetirada">Data Retirada *</Label>
              <Input
                id="dataRetirada"
                type="date"
                value={formData.dataRetirada}
                onChange={(e) =>
                  setFormData({ ...formData, dataRetirada: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataPrevistaDevolucao">Data Prev. Devolução *</Label>
              <Input
                id="dataPrevistaDevolucao"
                type="date"
                value={formData.dataPrevistaDevolucao}
                onChange={(e) =>
                  setFormData({ ...formData, dataPrevistaDevolucao: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dataDevolucaoReal">Data Devolução Real</Label>
            <Input
              id="dataDevolucaoReal"
              type="date"
              value={formData.dataDevolucaoReal || ''}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  dataDevolucaoReal: e.target.value || null 
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quilometragemInicial">KM Inicial *</Label>
              <Input
                id="quilometragemInicial"
                type="number"
                value={formData.quilometragemInicial}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    quilometragemInicial: parseInt(e.target.value) || 0 
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quilometragemFinal">KM Final</Label>
              <Input
                id="quilometragemFinal"
                type="number"
                value={formData.quilometragemFinal || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    quilometragemFinal: e.target.value ? parseInt(e.target.value) : null 
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="valorDiaria">Valor da Diária (R$) *</Label>
            <Input
              id="valorDiaria"
              type="number"
              step="0.01"
              value={formData.valorDiaria}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valorDiaria: parseFloat(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Valor Total Calculado</Label>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculateValorTotal())}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="statusAluguel">Status *</Label>
            <Select
              value={formData.statusAluguel || 'Ativo'}
              onValueChange={(value) =>
                setFormData({ ...formData, statusAluguel: value })
              }
            >
              <SelectTrigger id="statusAluguel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog de Confirmação de Exclusão */}
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este aluguel? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
}