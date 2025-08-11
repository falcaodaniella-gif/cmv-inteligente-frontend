import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Reports = () => {
  const [cmvReport, setCmvReport] = useState(null);
  const [purchaseListReport, setPurchaseListReport] = useState(null);
  const [cmvDates, setCmvDates] = useState({ start_date: '', end_date: '' });
  const [purchaseListInventoryId, setPurchaseListInventoryId] = useState('');

  const handleCmvDateChange = (e) => {
    const { name, value } = e.target;
    setCmvDates({ ...cmvDates, [name]: value });
  };

  const handlePurchaseListIdChange = (e) => {
    setPurchaseListInventoryId(e.target.value);
  };

  const fetchCmvReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reports/cmv?start_date=${cmvDates.start_date}&end_date=${cmvDates.end_date}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCmvReport(data);
      toast.success("Relatório de CMV gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório de CMV:", error);
      toast.error(`Erro ao gerar relatório de CMV: ${error.message}`);
      setCmvReport(null);
    }
  };

  const fetchPurchaseListReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reports/purchase_list?inventory_id=${purchaseListInventoryId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPurchaseListReport(data);
      toast.success("Lista de compras sugerida gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar lista de compras:", error);
      toast.error(`Erro ao gerar lista de compras: ${error.message}`);
      setPurchaseListReport(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      <Tabs defaultValue="cmv" className="w-full">
        <TabsList>
          <TabsTrigger value="cmv">CMV</TabsTrigger>
          <TabsTrigger value="purchase-list">Lista de Compras</TabsTrigger>
        </TabsList>
        <TabsContent value="cmv" className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Calcular CMV por Período</h2>
          <form onSubmit={fetchCmvReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                name="start_date"
                type="date"
                value={cmvDates.start_date}
                onChange={handleCmvDateChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                name="end_date"
                type="date"
                value={cmvDates.end_date}
                onChange={handleCmvDateChange}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">Gerar Relatório CMV</Button>
            </div>
          </form>

          {cmvReport && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Resultado CMV ({cmvReport.period.start_date} a {cmvReport.period.end_date})</h3>
              <p className="text-2xl font-bold mb-4">CMV Total: R$ {cmvReport.total_cmv.toFixed(2)}</p>
              <h4 className="text-md font-semibold mb-2">CMV por Produto:</h4>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Produto</th>
                    <th className="py-2 px-4 border-b">Estoque Inicial</th>
                    <th className="py-2 px-4 border-b">Compras</th>
                    <th className="py-2 px-4 border-b">Estoque Final</th>
                    <th className="py-2 px-4 border-b">Consumido</th>
                    <th className="py-2 px-4 border-b">CMV (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {cmvReport.products.map((product) => (
                    <tr key={product.product_id}>
                      <td className="py-2 px-4 border-b">{product.product_name}</td>
                      <td className="py-2 px-4 border-b text-center">{product.initial_stock}</td>
                      <td className="py-2 px-4 border-b text-center">{product.purchases_quantity}</td>
                      <td className="py-2 px-4 border-b text-center">{product.final_stock}</td>
                      <td className="py-2 px-4 border-b text-center">{product.consumed_quantity.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{product.cmv.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchase-list" className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Gerar Lista de Compras Sugerida</h2>
          <form onSubmit={fetchPurchaseListReport} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="inventoryId">ID do Último Inventário</Label>
              <Input
                id="inventoryId"
                name="inventory_id"
                type="number"
                value={purchaseListInventoryId}
                onChange={handlePurchaseListIdChange}
                placeholder="Ex: 1"
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">Gerar Lista de Compras</Button>
            </div>
          </form>

          {purchaseListReport && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Lista de Compras Sugerida (Baseado no Inventário ID: {purchaseListReport.inventory_id})</h3>
              <p className="text-2xl font-bold mb-4">Custo Estimado Total: R$ {purchaseListReport.total_estimated_cost.toFixed(2)}</p>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Produto</th>
                    <th className="py-2 px-4 border-b">Estoque Atual</th>
                    <th className="py-2 px-4 border-b">Consumo Estimado</th>
                    <th className="py-2 px-4 border-b">Sugestão de Compra</th>
                    <th className="py-2 px-4 border-b">Custo Unit. Estimado</th>
                    <th className="py-2 px-4 border-b">Custo Total Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseListReport.items.map((item) => (
                    <tr key={item.product_id}>
                      <td className="py-2 px-4 border-b">{item.product_name}</td>
                      <td className="py-2 px-4 border-b text-center">{item.current_stock}</td>
                      <td className="py-2 px-4 border-b text-center">{item.consumption.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-center">{item.suggested_quantity.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{item.estimated_unit_cost.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{item.estimated_cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
