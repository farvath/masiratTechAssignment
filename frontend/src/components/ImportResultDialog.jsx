import React from "react";

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

export default function ImportResultDialog({ open, onClose, result }) {
  if (!result) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Results</DialogTitle>
          <DialogDescription>
            {result.error
              ? <span className="text-destructive">{result.error}</span>
              : <>{result.added} product(s) added, {result.skipped} duplicate(s) skipped.</>}
          </DialogDescription>
        </DialogHeader>
        {result.duplicates && result.duplicates.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold mb-2">Duplicates:</div>
            <ul className="space-y-2 max-h-40 overflow-auto">
              {result.duplicates.map((item, idx) => (
                <li key={item.name + idx} className="flex items-center gap-2">
                  <Badge variant="secondary">{item.name}</Badge>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-400 mt-2">You can edit these products manually if needed.</div>
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
