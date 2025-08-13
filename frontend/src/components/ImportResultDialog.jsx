import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import EditDuplicateDialog from "./EditDuplicateDialog";
import { createProduct, fetchProducts } from "../api/productsApi";




export default function ImportResultDialog({ open, onClose, result }) {
  const [editIdx, setEditIdx] = useState(null);
  const [duplicates, setDuplicates] = useState(result?.duplicates || []);
  const [addedCount, setAddedCount] = useState(result?.added || 0);

  if (!result) return null;

  // Check for duplicate by name (simulate backend check)
  const checkDuplicate = async (name) => {
    // Option 1: check in current duplicates
    if (duplicates.some((d) => d.name === name)) return true;
    // Option 2: check in DB (call backend)
    const res = await fetchProducts({ name });
    return Array.isArray(res.data) ? res.data.length > 0 : (res.data.products?.length > 0);
  };

  // Add product to DB and update UI
  const handleAddProduct = async (product) => {
    await createProduct(product);
    setAddedCount((c) => c + 1);
    setDuplicates((prev) => prev.filter((d, i) => i !== editIdx));
    setEditIdx(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Results</DialogTitle>
          <DialogDescription>
            {result.error
              ? <span className="text-destructive">{result.error}</span>
              : <>{addedCount} product(s) added, {duplicates.length} duplicate(s) skipped.</>}
          </DialogDescription>
        </DialogHeader>
        {duplicates.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold mb-2">Duplicates:</div>
            <ul className="space-y-2 max-h-40 overflow-auto">
              {duplicates.map((item, idx) => (
                <li key={item.name + idx} className="flex items-center gap-2">
                  <Badge variant="secondary">{item.name}</Badge>
                  <span className="text-xs text-gray-500">{item.category}</span>
                  <Button size="sm" variant="outline" onClick={() => setEditIdx(idx)}>
                    Edit
                  </Button>
                  {editIdx === idx && (
                    <EditDuplicateDialog
                      open={true}
                      onClose={() => setEditIdx(null)}
                      duplicate={item}
                      onSubmit={handleAddProduct}
                      checkDuplicate={checkDuplicate}
                    />
                  )}
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-400 mt-2">Edit and add duplicates directly here.</div>
          </div>
        )}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
