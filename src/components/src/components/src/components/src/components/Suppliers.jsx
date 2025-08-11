import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact_info: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

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
      toast.error("Erro ao carregar fornecedores.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Fornecedor adicionado com sucesso!");
      setNewSupplier({ name: '', contact_info: '' });
      fetchSuppliers();
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      toast.error("Erro ao adicionar fornecedor.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fornecedores</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Fornecedor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              placeholder="Nome do Fornecedor"
              required
            />
          </div>
          <div>
            <Label htmlFor="contact_info">Informações de Contato</Label>
            <Input
              id="contact_info"
              name="contact_info"
              value={newSupplier.contact_info}
              onChange={handleInputChange}
              placeholder="Telefone, Email, etc."
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Adicionar Fornecedor</Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Lista de Fornecedores</h2>
        {suppliers.length === 0 ? (
          <p>Nenhum fornecedor cadastrado.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">Contato</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="py-2 px-4 border-b text-center">{supplier.id}</td>
                  <td className="py-2 px-4 border-b">{supplier.name}</td>
                  <td className="py-2 px-4 border-b">{supplier.contact_info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
