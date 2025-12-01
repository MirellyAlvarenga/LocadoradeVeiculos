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
import { fabricantesService, Fabricante, FabricanteCreate } from '../services/fabricantesService';

export function FabricantesPage() {
const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [dialogOpen, setDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [editingFabricante, setEditingFabricante] = useState<Fabricante | null>(null);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<FabricanteCreate>({
  nome: '',
  paisOrigem: '',
});

useEffect(() => {
  loadFabricantes();
}, []);

const loadFabricantes = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await fabricantesService.getAll();
    setFabricantes(data);
  } catch (err) {
    setError('Erro ao carregar fabricantes');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredFabricantes = fabricantes.filter(
  (fabricante) =>
    fabricante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fabricante.paisOrigem?.toLowerCase() || '').includes(searchTerm.toLowerCase())
);

const handleOpenDialog = (fabricante?: Fabricante) => {
  if (fabricante) {
    setEditingFabricante(fabricante);
    setFormData({
      nome: fabricante.nome,
      paisOrigem: fabricante.paisOrigem || '',
    });
  } else {
    setEditingFabricante(null);
    setFormData({
      nome: '',
      paisOrigem: '',
    });
  }
  setDialogOpen(true);
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);

    if (editingFabricante) {
      await fabricantesService.update(editingFabricante.idFabricante, formData);
    } else {
      await fabricantesService.create(formData);
    }

    await loadFabricantes();
    setDialogOpen(false);
  } catch (err) {
    setError('Erro ao salvar fabricante');
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
      await fabricantesService.delete(deletingId);
      await loadFabricantes();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Erro ao excluir fabricante');
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

if (loading && fabricantes.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl">Fabricantes</h2>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Fabricante
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
          placeholder="Buscar por nome ou país..."
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
            <TableHead>País de Origem</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFabricantes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhum fabricante encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredFabricantes.map((fabricante) => (
              <TableRow key={fabricante.idFabricante}>
                <TableCell>{fabricante.idFabricante}</TableCell>
                <TableCell>{fabricante.nome}</TableCell>
                <TableCell>{fabricante.paisOrigem || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(fabricante)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(fabricante.idFabricante)}
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
            {editingFabricante ? 'Editar Fabricante' : 'Novo Fabricante'}
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
            <Label htmlFor="paisOrigem">País de Origem</Label>
            <Input
              id="paisOrigem"
              value={formData.paisOrigem ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, paisOrigem: e.target.value })
              }
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
            Tem certeza que deseja excluir este fabricante? Esta ação não pode ser
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