import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";

export default function SearchBar({ onSearch }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    onSearch({ name, category });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Electronics">Electronics</SelectItem>
          <SelectItem value="Clothing">Clothing</SelectItem>
          <SelectItem value="Food">Food</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="w-full sm:w-auto">
        Search
      </Button>
    </div>
  );
}
