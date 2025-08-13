import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import ImportResultDialog from "./ImportResultDialog";

export default function ImportExportButtons({ onImportSuccess, importCSV, exportCSV }) {
  const fileInputRef = useRef(null);
  const [importResult, setImportResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await importCSV(file);
        setImportResult(res.data);
        setShowResult(true);
        onImportSuccess();
      } catch (err) {
        setImportResult({ error: "Failed to import CSV" });
        setShowResult(true);
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
    <>
      <div className="flex gap-2 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onFileChange}
        />
        <Button onClick={handleImportClick} variant="outline" size="sm">
          Import CSV
        </Button>
        <Button onClick={handleExportClick} variant="outline" size="sm">
          Export CSV
        </Button>
      </div>
      <ImportResultDialog
        open={showResult}
        onClose={() => setShowResult(false)}
        result={importResult}
      />
    </>
  );
}
