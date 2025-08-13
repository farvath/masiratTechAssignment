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
} from "../api/productsApi";

export default function ProductsPage() {
  const [filters, setFilters] = useState({});

  // useCallbacks for memoization
  const memoFetchProducts = useCallback(fetchProducts, []);
  const memoImportCSV = useCallback(importCSV, []);
  const memoExportCSV = useCallback(exportCSV, []);
  const memoUpdateProduct = useCallback(updateProduct, []);
  const memoGetProductHistory = useCallback(getProductHistory, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Inventory</h1>
      <SearchBar onSearch={setFilters} />
      <ImportExportButtons onImportSuccess={() => setFilters({ ...filters })} importCSV={memoImportCSV} exportCSV={memoExportCSV} />
      <ProductTable
        filters={filters}
        fetchProducts={memoFetchProducts}
        updateProduct={memoUpdateProduct}
        getProductHistory={memoGetProductHistory}
      />
    </div>
  );
}
