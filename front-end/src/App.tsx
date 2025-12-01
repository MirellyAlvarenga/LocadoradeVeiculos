import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { ClientesPage } from './components/ClientesPage';
import { VeiculosPage } from './components/VeiculosPage';
import { FabricantesPage } from './components/FabricantesPage';
import { CategoriasPage } from './components/CategoriasPage';
import { AlugueisPage } from './components/AlugueisPage';

type Page = 'clientes' | 'veiculos' | 'fabricantes' | 'categorias' | 'alugueis';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('clientes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'clientes' as Page, label: 'Clientes' },
    { id: 'veiculos' as Page, label: 'Veículos' },
    { id: 'fabricantes' as Page, label: 'Fabricantes' },
    { id: 'categorias' as Page, label: 'Categorias' },
    { id: 'alugueis' as Page, label: 'Aluguéis' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'clientes':
        return <ClientesPage />;
      case 'veiculos':
        return <VeiculosPage />;
      case 'fabricantes':
        return <FabricantesPage />;
      case 'categorias':
        return <CategoriasPage />;
      case 'alugueis':
        return <AlugueisPage />;
    }
  };

  const Sidebar = () => (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setCurrentPage(item.id);
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            currentPage === item.id
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-8">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl">Sistema de Aluguel de Veículos</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
