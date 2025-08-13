
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
// ...existing code...
import { Input } from './ui/input';
import { fetchCategories, createProduct } from '../api/productsApi';

export default function AddProductDialog({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
    image: ''
  });
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadCategories();
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', unit: '', category: '', brand: '', stock: 0, image: '' });
    } catch (error) {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input
              required
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              autoComplete="off"
              placeholder="Type or select category"
              value={formData.category}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
            {showSuggestions && categories.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-auto">
                {categories.filter(cat => cat.toLowerCase().includes(formData.category.toLowerCase()) && cat !== formData.category).map(cat => (
                  <div
                    key={cat}
                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                    onMouseDown={() => setFormData(prev => ({ ...prev, category: cat }))}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
            {!categories.includes(formData.category) && formData.category && (
              <p className="text-sm text-gray-500 mt-1">New category will be created</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <Input
              required
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <Input
              required
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="http://..."
            />
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
