import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newInventory, setNewInventory] = useState({
    date: '',
    items: [{ product_id: '', quantity: '' }],
  });

  useEffect(() => {
    fetchInventories();
    fetchProducts();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await fetch('/api/inventories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInventories(data);
    } catch (error) {
      console.error("Erro ao buscar inventários:", error);
      toast.error("Erro ao carregar inventários.");
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
      toast.error("Erro ao carregar produtos para inventário.");
    }
  };

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setNewInventory({ ...newInventory, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = newInventory.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setNewInventory({ ...newInventory, items: updatedItems });
  };

  const handleAddItem = () => {
    setNewInventory({
      ...newInventory,
      items: [...newInventory.items, { product_id: '', quantity: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = newInventory.items.filter((_, i) => i !== index);
    setNewInventory({ ...newInventory, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newInventory,
          items: newInventory.items.map(item => ({
            product_id: parseInt(item.product_id),
            quantity: parseFloat(item.quantity),
          })),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      toast.success("Inventário registrado com sucesso!");
      setNewInventory({
        date: '',
        items: [{ product_id: '', quantity: '' }],
      });
      fetchInventories();
    } catch (error) {
      console.error("Erro ao registrar inventário:", error);
      toast.error(`Erro ao registrar inventário: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventário</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Registrar Novo Inventário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inventoryDate">Data do Inventário</Label>
            <Input
              id="inventoryDate"
              name="date"
              type="date"
              value={newInventory.date}
              onChange={handleInventoryChange}
              required
            />
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Itens do Inventário</h3>
          {newInventory.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
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
                  placeholder="Quantidade em estoque"
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
            <Button type="submit">Registrar Inventário</Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Histórico de Inventários</h2>
        {inventories.length === 0 ? (
          <p>Nenhum inventário registrado.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Data</th>
                <th className="py-2 px-4 border-b">Itens</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inventory) => (
                <tr key={inventory.id}>
                  <td className="py-2 px-4 border-b text-center">{inventory.id}</td>
                  <td className="py-2 px-4 border-b">{inventory.date}</td>
                  <td className="py-2 px-4 border-b">
                    <ul className="list-disc list-inside">
                      {inventory.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.product_name}: {item.quantity} {products.find(p => p.id === item.product_id)?.unit}</li>
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

export default Inventory;
