import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";

import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownRight, User2 } from "lucide-react";

export default function InventoryHistoryDrawer({ isOpen, onClose, history }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] sm:w-[400px]">
        <DialogHeader>
          <DialogTitle>Inventory History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-64 mt-4 pr-2">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No history available</div>
          ) : (
            <ul className="space-y-4">
              {history.map((item, idx) => {
                const isIncrease = item.newQuantity > item.oldQuantity;
                const diff = item.newQuantity - item.oldQuantity;
                return (
                  <li key={item._id} className="relative bg-muted rounded-lg p-4 flex flex-col gap-2 border">
                    <div className="flex items-center gap-2">
                      {isIncrease ? (
                        <ArrowUpRight className="text-green-600" size={18} />
                      ) : (
                        <ArrowDownRight className="text-red-600" size={18} />
                      )}
                      <span className={`font-semibold ${isIncrease ? 'text-green-700' : 'text-red-700'}`}>
                        {isIncrease ? '+' : ''}{diff}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Stock: <Badge variant="outline">{item.oldQuantity}</Badge> → <Badge variant="outline">{item.newQuantity}</Badge></span>
                      <span className="flex items-center gap-1 ml-auto text-xs text-gray-500">
                        <User2 className="w-4 h-4" />
                        {item.updatedBy}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
