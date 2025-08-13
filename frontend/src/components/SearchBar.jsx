
import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { fetchCategories } from "../api/productsApi";

export default function SearchBar({ onSearch }) {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const debounceRef = useRef();

  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  // Debounce name search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch({ name, category });
    }, 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [name]);

  // Immediate search on category change
  useEffect(() => {
    onSearch({ name, category });
    // eslint-disable-next-line
  }, [category]);

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
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="w-full sm:w-auto">
        Search
      </Button>
    </div>
  );
}
