import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

export default function InventoryHistoryDrawer({ isOpen, onClose, history }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] sm:w-[400px]">
        <DialogHeader>
          <DialogTitle>Inventory History</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" className="absolute top-2 right-2">
              Close
            </Button>
          </DialogClose>
        </DialogHeader>
        <ScrollArea className="h-64 mt-4">
          {history.length === 0 && <p>No history available</p>}
          <ul>
            {history.map((item) => (
              <li key={item._id} className="mb-4">
                <p className="font-semibold">
                  {new Date(item.date).toLocaleString()}
                </p>
                <p>
                  {item.oldQuantity} &rarr; {item.newQuantity} (by{" "}
                  {item.updatedBy})
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
