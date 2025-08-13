import React from "react";
import { Button } from "./ui/button";

export default function ImportExportButtons({ onImportSuccess, importCSV, exportCSV }) {
  const fileInputRef = React.useRef(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importCSV(file);
        alert("CSV imported successfully");
        onImportSuccess();
      } catch (err) {
        alert("Failed to import CSV");
      }
    }
  };

  const handleExportClick = async () => {
    try {
      const res = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to export CSV");
    }
  };

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={onFileChange}
      />
      <Button onClick={handleImportClick} variant="outline">
        Import CSV
      </Button>
      <Button onClick={handleExportClick} variant="outline">
        Export CSV
      </Button>
    </div>
  );
}
