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
import { Textarea } from './ui/textarea';
import { categoriasService, CategoriaVeiculo, CategoriaCreate } from '../services/categoriasService';

export function CategoriasPage() {
const [categorias, setCategorias] = useState<CategoriaVeiculo[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [dialogOpen, setDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [editingCategoria, setEditingCategoria] = useState<CategoriaVeiculo | null>(null);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<CategoriaCreate>({
  nome: '',
  descricao: '',
  valorDiariaBase: 0,
});

useEffect(() => {
  loadCategorias();
}, []);

const loadCategorias = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await categoriasService.getAll();
    setCategorias(data);
  } catch (err) {
    setError('Erro ao carregar categorias');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredCategorias = categorias.filter(
  (categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoria.descricao?.toLowerCase() || '').includes(searchTerm.toLowerCase())
);

const handleOpenDialog = (categoria?: CategoriaVeiculo) => {
  if (categoria) {
    setEditingCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
      valorDiariaBase: categoria.valorDiariaBase,
    });
  } else {
    setEditingCategoria(null);
    setFormData({
      nome: '',
      descricao: '',
      valorDiariaBase: 0,
    });
  }
  setDialogOpen(true);
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);

    if (editingCategoria) {
      await categoriasService.update(editingCategoria.idCategoria, formData);
    } else {
      await categoriasService.create(formData);
    }

    await loadCategorias();
    setDialogOpen(false);
  } catch (err) {
    setError('Erro ao salvar categoria');
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
      await categoriasService.delete(deletingId);
      await loadCategorias();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Erro ao excluir categoria');
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

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

if (loading && categorias.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl">Categorias de Veículos</h2>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="h-4 w-4 mr-2" />
        Nova Categoria
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
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>

    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor Diária Base</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategorias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhuma categoria encontrada
              </TableCell>
            </TableRow>
          ) : (
            filteredCategorias.map((categoria) => (
              <TableRow key={categoria.idCategoria}>
                <TableCell>{categoria.idCategoria}</TableCell>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao || '-'}</TableCell>
                <TableCell>{formatCurrency(categoria.valorDiariaBase)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(categoria)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(categoria.idCategoria)}
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
            {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valorDiariaBase">Valor Diária Base (R$) *</Label>
            <Input
              id="valorDiariaBase"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorDiariaBase}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valorDiariaBase: parseFloat(e.target.value) || 0,
                })
              }
              required
            />
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
            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser
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