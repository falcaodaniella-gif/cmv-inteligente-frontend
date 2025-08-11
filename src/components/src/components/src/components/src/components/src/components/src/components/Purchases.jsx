import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    date: '',
    supplier_id: '',
    items: [{ product_id: '', quantity: '', unit_cost: '' }],
  });

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
      toast.error("Erro ao carregar compras.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar produtos para compra.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      toast.error("Erro ao carregar fornecedores para compra.");
    }
  };

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = newPurchase.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setNewPurchase({ ...newPurchase, items: updatedItems });
  };

  const handleAddItem = () => {
    setNewPurchase({
      ...newPurchase,
      items: [...newPurchase.items, { product_id: '', quantity: '', unit_cost: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = newPurchase.items.filter((_, i) => i !== index);
    setNewPurchase({ ...newPurchase, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPurchase,
          supplier_id: parseInt(newPurchase.supplier_id),
          items: newPurchase.items.map(item => ({
            product_id: parseInt(item.product_id),
            quantity: parseFloat(item.quantity),
            unit_cost: parseFloat(item.unit_cost),
          })),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      toast.success("Compra adicionada com sucesso!");
      setNewPurchase({
        date: '',
        supplier_id: '',
        items: [{ product_id: '', quantity: '', unit_cost: '' }],
      });
      fetchPurchases();
    } catch (error) {
      console.error("Erro ao adicionar compra:", error);
      toast.error(`Erro ao adicionar compra: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Compras</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Registrar Nova Compra</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="purchaseDate">Data da Compra</Label>
            <Input
              id="purchaseDate"
              name="date"
              type="date"
              value={newPurchase.date}
              onChange={handlePurchaseChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="supplier">Fornecedor</Label>
            <select
              id="supplier"
              name="supplier_id"
              value={newPurchase.supplier_id}
              onChange={handlePurchaseChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Itens da Compra</h3>
          {newPurchase.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md">
              <div>
                <Label htmlFor={`product-${index}`}>Produto</Label>
                <select
                  id={`product-${index}`}
                  name="product_id"
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, e)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`quantity-${index}`}>Quantidade</Label>
                <Input
                  id={`quantity-${index}`}
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Quantidade"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`unitCost-${index}`}>Custo Unitário</Label>
                <Input
                  id={`unitCost-${index}`}
                  name="unit_cost"
                  type="number"
                  step="0.01"
                  value={item.unit_cost}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Custo por unidade"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="destructive" onClick={() => handleRemoveItem(index)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={handleAddItem} className="mt-2">
            Adicionar Item
          </Button>

          <div className="pt-4">
            <Button type="submit">Registrar Compra</Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Histórico de Compras</h2>
        {purchases.length === 0 ? (
          <p>Nenhuma compra registrada.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Data</th>
                <th className="py-2 px-4 border-b">Fornecedor</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Itens</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="py-2 px-4 border-b text-center">{purchase.id}</td>
                  <td className="py-2 px-4 border-b">{purchase.date}</td>
                  <td className="py-2 px-4 border-b">{purchase.supplier_name}</td>
                  <td className="py-2 px-4 border-b">R$ {purchase.total_amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <ul className="list-disc list-inside">
                      {purchase.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.product_name}: {item.quantity} {products.find(p => p.id === item.product_id)?.unit} @ R$ {item.unit_cost.toFixed(2)}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Purchases;
