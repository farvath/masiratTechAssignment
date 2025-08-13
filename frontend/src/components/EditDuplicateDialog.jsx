import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function EditDuplicateDialog({ open, onClose, duplicate, onSubmit, checkDuplicate }) {
  const [form, setForm] = useState({ ...duplicate });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const isDup = await checkDuplicate(form.name);
      if (isDup) {
        setError("A product with this name already exists.");
        setLoading(false);
        return;
      }
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  if (!duplicate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Duplicate Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Product Name"
          />
          <Input
            label="Unit"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Unit"
          />
          <Input
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <Input
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
          />
          <Input
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & Add"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
