import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import AddProductDialog from "./AddProductDialog";
import InventoryHistoryDrawer from "./InventoryHistoryDrawer";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export default function ProductTable({ filters, fetchProducts, updateProduct, getProductHistory, deleteProduct }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [historyVisible, setHistoryVisible] = useState(false);
  const [addProductVisible, setAddProductVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  function isInStock(product) {
    return product.stock > 0;
  }

  // Load products applying filters


  // Only run when filters, sorting, or pagination values change
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), JSON.stringify(sorting), pagination.pageIndex, pagination.pageSize]);

  const loadProducts = async () => {
    try {
      const sortField = sorting.length > 0 ? sorting[0].id : undefined;
      const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;
      const params = {
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortField,
        sortOrder,
      };
      const res = await fetchProducts(params);
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        setTotal(res.data.total || 0);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(res.data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setTotal(0);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditingData({ ...product });
  };

  const handleSave = async (id) => {
    try {
      await updateProduct(id, editingData);
      setEditingId(null);
      await loadProducts();
    } catch {
      alert("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleChange = (id, field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: field === 'stock' ? Number(value) : value
    }));
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
        header: ({ column }) => (
          <div className="cursor-pointer" onClick={() => column.toggleSorting()}>
            Name {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
          </div>
        ),
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              value={editingData.name}
              onChange={(e) => handleChange(product._id, 'name', e.target.value)}
            />
          ) : (
            product.name
          );
        },
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              value={editingData.unit}
              onChange={(e) => handleChange(product._id, 'unit', e.target.value)}
            />
          ) : (
            product.unit
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <div className="cursor-pointer" onClick={() => column.toggleSorting()}>
            Category {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
          </div>
        ),
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              value={editingData.category}
              onChange={(e) => handleChange(product._id, 'category', e.target.value)}
            />
          ) : (
            product.category
          );
        },
      },
      {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              value={editingData.brand}
              onChange={(e) => handleChange(product._id, 'brand', e.target.value)}
            />
          ) : (
            product.brand
          );
        },
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <div className="cursor-pointer" onClick={() => column.toggleSorting()}>
            Stock {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
          </div>
        ),
        cell: ({ row }) => {
          const product = row.original;
          return editingId === product._id ? (
            <Input
              type="number"
              value={editingData.stock}
              onChange={(e) => handleChange(product._id, 'stock', e.target.value)}
              className="w-20"
            />
          ) : (
            product.stock
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row, getValue }) => {
          const product = row.original;
          const status = getValue();
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
              <Button size="sm" onClick={() => handleSave(product._id)}>
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
                onClick={() => handleEdit(product)}
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
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [editingId, editingData]
  );

  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));
  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddProductVisible(true)}>
          Add New Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
  <span className="text-sm text-gray-700">Page {table.getState().pagination.pageIndex + 1} of {pageCount}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <Select value={String(pagination.pageSize)} onValueChange={val => setPagination(p => ({ ...p, pageSize: Number(val), pageIndex: 0 }))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25].map(size => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">per page</span>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-gray-200 p-3 text-left font-semibold text-gray-600"
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-6 text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-gray-200 p-3"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>

      <InventoryHistoryDrawer
        isOpen={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
      />

      {addProductVisible && (
        <AddProductDialog
          isOpen={addProductVisible}
          onClose={() => setAddProductVisible(false)}
          onSuccess={() => {
            setAddProductVisible(false);
            loadProducts();
          }}
        />
      )}
    </>
  );
}
