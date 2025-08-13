import React, { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import ImportExportButtons from "../components/ImportExportButtons";
import ProductTable from "../components/ProductTable";
import {
  fetchProducts,
  importCSV,
  exportCSV,
  updateProduct,
  getProductHistory,
  deleteProduct,
} from "../api/productsApi";

export default function ProductsPage() {
  const [filters, setFilters] = useState({});

  // useCallbacks for memoization
  const memoFetchProducts = useCallback(fetchProducts, []);
  const memoImportCSV = useCallback(importCSV, []);
  const memoExportCSV = useCallback(exportCSV, []);
  const memoUpdateProduct = useCallback(updateProduct, []);
  const memoGetProductHistory = useCallback(getProductHistory, []);
  const memoDeleteProduct = useCallback(deleteProduct, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <ImportExportButtons 
          onImportSuccess={() => setFilters({ ...filters })} 
          importCSV={memoImportCSV} 
          exportCSV={memoExportCSV} 
        />
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={setFilters} />
      </div>

      <ProductTable
        filters={filters}
        fetchProducts={memoFetchProducts}
        updateProduct={memoUpdateProduct}
        getProductHistory={memoGetProductHistory}
        deleteProduct={memoDeleteProduct}
      />
    </div>
  );
}
