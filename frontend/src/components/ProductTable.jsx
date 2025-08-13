import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import InventoryHistoryDrawer from "./InventoryHistoryDrawer";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ProductTable({ filters, fetchProducts, updateProduct, getProductHistory }) {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [stockValue, setStockValue] = useState(0);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);

  function isInStock(product) {
    return product.stock > 0;
  }

  // Load products applying filters
  useEffect(() => {
    (async () => {
      const res = await fetchProducts(filters);
      setProducts(res.data);
    })();
  }, [filters, fetchProducts]);

  const saveStock = async (id) => {
    try {
      await updateProduct(id, { stock: stockValue, updatedBy: "admin" });
      alert("Stock updated");
      setEditingId(null);
      const res = await fetchProducts(filters);
      setProducts(res.data);
    } catch {
      alert("Failed to update stock");
    }
  };

  const viewHistory = async (id) => {
    const res = await getProductHistory(id);
    setHistory(res.data);
    setHistoryVisible(true);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ getValue }) => (
          <img src={getValue()} alt="" className="w-12 h-12 object-contain" />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "unit",
        header: "Unit",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "brand",
        header: "Brand",
      },
      {
        id: "stock",
        header: "Stock",
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(Number(e.target.value))}
              className="w-20"
            />
          ) : (
            <span>{product.stock}</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row, getValue }) => {
          const product = row.original;
          const status = getValue(); // so we can still display backend status text
          const inStock = isInStock(product);
          return (
            <Badge
              className={`capitalize ${
                inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => saveStock(product._id)}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(product._id);
                  setStockValue(product.stock);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => viewHistory(product._id)}
              >
                History
              </Button>
            </div>
          );
        },
      },
    ],
    [editingId, stockValue]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-200 p-2 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-200 p-2 align-middle"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InventoryHistoryDrawer
        isOpen={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
      />
    </>
  );
}
