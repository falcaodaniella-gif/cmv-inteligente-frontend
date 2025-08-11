import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">CMV Mensal</h2>
          <p className="text-gray-600">R$ 5.200,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Estoque Atual</h2>
          <p className="text-gray-600">R$ 12.500,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Últimas Compras</h2>
          <p className="text-gray-600">5 novas compras</p>
        </div>
      </div>
      {/* Adicione mais gráficos ou informações aqui */}
    </div>
  );
};

export default Dashboard;
