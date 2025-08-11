import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from './components/ui/button';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Suppliers from './components/Suppliers';
import Purchases from './components/Purchases';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import { Toaster } from './components/ui/sonner';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
          {/* Conteúdo de teste temporário */}
          <div className="mt-8 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Sistema CMV Inteligente</h2>
            <p className="mb-4">Este é um sistema completo e inteligente para calcular CMV (Custo da Mercadoria Vendida) desenvolvido especialmente para restaurantes, com funcionalidades de:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Cadastro de produtos e fornecedores</li>
              <li>Registro de compras</li>
              <li>Controle de inventário</li>
              <li>Cálculo automático de CMV</li>
              <li>Relatórios detalhados</li>
              <li>Lista de compras sugerida baseada no consumo</li>
            </ul>
            <Button onClick={() => setCount((count) => count + 1)}>
              Teste: {count} cliques
            </Button>
          </div>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
