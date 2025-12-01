import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { veiculosService, VeiculoDto, VeiculoCreate } from '../services/veiculosService';
import { fabricantesService, Fabricante } from '../services/fabricantesService';
import { categoriasService, CategoriaVeiculo } from '../services/categoriasService';

export function VeiculosPage() {
const [veiculos, setVeiculos] = useState<VeiculoDto[]>([]);
const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
const [categorias, setCategorias] = useState<CategoriaVeiculo[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [disponibilidadeFilter, setDisponibilidadeFilter] = useState<string>('todos');
const [dialogOpen, setDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [editingVeiculo, setEditingVeiculo] = useState<VeiculoDto | null>(null);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<VeiculoCreate>({
  modelo: '',
  anoFabricacao: new Date().getFullYear(),
  quilometragemAtual: 0,
  placa: '',
  cor: '',
  disponivel: true,
  idFabricante: 0,
  idCategoria: 0,
});

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const [veiculosData, fabricantesData, categoriasData] = await Promise.all([
      veiculosService.getAll(),
      fabricantesService.getAll(),
      categoriasService.getAll(),
    ]);
    setVeiculos(veiculosData);
    setFabricantes(fabricantesData);
    setCategorias(categoriasData);
  } catch (err) {
    setError('Erro ao carregar dados');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredVeiculos = veiculos.filter((veiculo) => {
  const matchesSearch =
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.fabricanteNome.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesDisponibilidade =
    disponibilidadeFilter === 'todos' ||
    (disponibilidadeFilter === 'disponivel' && veiculo.disponivel) ||
    (disponibilidadeFilter === 'indisponivel' && !veiculo.disponivel);
  
  return matchesSearch && matchesDisponibilidade;
});

const handleOpenDialog = (veiculo?: VeiculoDto) => {
  if (veiculo) {
    setEditingVeiculo(veiculo);
    // Encontrar IDs correspondentes
    const fabricante = fabricantes.find(f => f.nome === veiculo.fabricanteNome);
    const categoria = categorias.find(c => c.nome === veiculo.categoriaNome);
    
    setFormData({
      modelo: veiculo.modelo,
      anoFabricacao: veiculo.anoFabricacao,
      quilometragemAtual: veiculo.quilometragemAtual,
      placa: veiculo.placa,
      cor: veiculo.cor || '',
      disponivel: veiculo.disponivel,
      idFabricante: fabricante?.idFabricante || 0,
      idCategoria: categoria?.idCategoria || 0,
    });
  } else {
    setEditingVeiculo(null);
    setFormData({
      modelo: '',
      anoFabricacao: new Date().getFullYear(),
      quilometragemAtual: 0,
      placa: '',
      cor: '',
      disponivel: true,
      idFabricante: 0,
      idCategoria: 0,
    });
  }
  setDialogOpen(true);
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);

    if (editingVeiculo) {
      await veiculosService.update(editingVeiculo.idVeiculo, formData);
    } else {
      await veiculosService.create(formData);
    }

    await loadData();
    setDialogOpen(false);
  } catch (err) {
    setError('Erro ao salvar veículo');
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
      await veiculosService.delete(deletingId);
      await loadData();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Erro ao excluir veículo');
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

const getDisponibilidadeBadge = (disponivel: boolean) => {
  return disponivel ? (
    <Badge className="bg-green-500">Disponível</Badge>
  ) : (
    <Badge className="bg-red-500">Indisponível</Badge>
  );
};

if (loading && veiculos.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl">Veículos</h2>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Veículo
      </Button>
    </div>

    {error && (
      <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por modelo, placa ou fabricante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={disponibilidadeFilter} onValueChange={setDisponibilidadeFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por disponibilidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="disponivel">Disponível</SelectItem>
          <SelectItem value="indisponivel">Indisponível</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>KM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVeiculos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Nenhum veículo encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredVeiculos.map((veiculo) => (
              <TableRow key={veiculo.idVeiculo}>
                <TableCell>{veiculo.modelo}</TableCell>
                <TableCell>{veiculo.placa}</TableCell>
                <TableCell>{veiculo.anoFabricacao}</TableCell>
                <TableCell>{veiculo.cor || '-'}</TableCell>
                <TableCell>{veiculo.fabricanteNome}</TableCell>
                <TableCell>{veiculo.categoriaNome}</TableCell>
                <TableCell>{veiculo.quilometragemAtual.toLocaleString()}</TableCell>
                <TableCell>{getDisponibilidadeBadge(veiculo.disponivel)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(veiculo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(veiculo.idVeiculo)}
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

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                value={formData.placa}
                onChange={(e) =>
                  setFormData({ ...formData, placa: e.target.value })
                }
                placeholder="ABC-1234"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="anoFabricacao">Ano *</Label>
              <Input
                id="anoFabricacao"
                type="number"
                value={formData.anoFabricacao}
                onChange={(e) =>
                  setFormData({ ...formData, anoFabricacao: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={formData.cor ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, cor: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quilometragemAtual">Quilometragem Atual *</Label>
            <Input
              id="quilometragemAtual"
              type="number"
              value={formData.quilometragemAtual}
              onChange={(e) =>
                setFormData({ ...formData, quilometragemAtual: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fabricante">Fabricante *</Label>
            <Select
              value={formData.idFabricante.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, idFabricante: parseInt(value) })
              }
            >
              <SelectTrigger id="fabricante">
                <SelectValue placeholder="Selecione um fabricante" />
              </SelectTrigger>
              <SelectContent>
                {fabricantes.map((fab) => (
                  <SelectItem key={fab.idFabricante} value={fab.idFabricante.toString()}>
                    {fab.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={formData.idCategoria.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, idCategoria: parseInt(value) })
              }
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.idCategoria} value={cat.idCategoria.toString()}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disponivel">Disponibilidade *</Label>
            <Select
              value={formData.disponivel.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, disponivel: value === 'true' })
              }
            >
              <SelectTrigger id="disponivel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Disponível</SelectItem>
                <SelectItem value="false">Indisponível</SelectItem>
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

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este veículo? Esta ação não pode ser
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