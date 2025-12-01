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
import { clientesService, Cliente, ClienteCreate } from '../services/clientesService';

export function ClientesPage() {
const [clientes, setClientes] = useState<Cliente[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [dialogOpen, setDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<ClienteCreate>({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  dataNascimento: '',
});

useEffect(() => {
  loadClientes();
}, []);

const loadClientes = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await clientesService.getAll();
    setClientes(data);
  } catch (err) {
    setError('Erro ao carregar clientes');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredClientes = clientes.filter(
  (cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleOpenDialog = (cliente?: Cliente) => {
  if (cliente) {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      telefone: cliente.telefone || '',
      dataNascimento: cliente.dataNascimento.split('T')[0],
    });
  } else {
    setEditingCliente(null);
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      dataNascimento: '',
    });
  }
  setDialogOpen(true);
};

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);

    if (editingCliente) {
      await clientesService.update(editingCliente.idCliente, formData);
    } else {
      await clientesService.create(formData);
    }

    await loadClientes();
    setDialogOpen(false);
  } catch (err) {
    setError('Erro ao salvar cliente');
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
      await clientesService.delete(deletingId);
      await loadClientes();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      setError('Erro ao excluir cliente');
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

if (loading && clientes.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl">Clientes</h2>
      <Button onClick={() => handleOpenDialog()}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Cliente
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
          placeholder="Buscar por nome, CPF ou email..."
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
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Data Nascimento</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredClientes.map((cliente) => (
              <TableRow key={cliente.idCliente}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefone || '-'}</TableCell>
                <TableCell>{formatDate(cliente.dataNascimento)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(cliente)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(cliente.idCliente)}
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
            {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
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
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) =>
                setFormData({ ...formData, dataNascimento: e.target.value })
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
            Tem certeza que deseja excluir este cliente? Esta ação não pode ser
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