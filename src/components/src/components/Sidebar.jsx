import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Truck, ShoppingCart, BarChart2, Box } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6">CMV Inteligente</div>
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link to="/" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <Home className="mr-3" size={20} /> Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/products" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <Package className="mr-3" size={20} /> Produtos
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/suppliers" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <Truck className="mr-3" size={20} /> Fornecedores
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/purchases" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <ShoppingCart className="mr-3" size={20} /> Compras
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/inventory" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <Box className="mr-3" size={20} /> Inventário
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/reports" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <BarChart2 className="mr-3" size={20} /> Relatórios
            </Link>
          </li>
        </ul>
      </nav>
      <div className="text-sm text-gray-400 mt-auto">
        Desenvolvido por Fábio Bindes
      </div>
    </aside>
  );
};

export default Sidebar;
