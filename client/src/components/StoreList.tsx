"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllStores } from "@/services/store.service";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  name?: string;
};

type Store = {
  id: string;
  name: string;
  address: string;
  owner: User;
  averageRating: number;
  userRating?: number | null;
};

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const fetchAllStores = async () => {
    setIsLoading(true);
    try {
      const response = await getAllStores();
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error while fetching stores:", error);
      alert("Failed to fetch stores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStores();
  }, []);

  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.owner.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      store.address.toLowerCase().includes(filters.address.toLowerCase())
    );
  });


  return (
    <div className="w-full space-y-10 px-4 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Input
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
          className="h-12"
        />
        <Input
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
          className="h-12"
        />
        <Input
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
          className="h-12"
        />
        <Button
          variant="outline"
          className="w-full h-12 bg-slate-300 text-slate-900 hover:bg-slate-200 cursor-pointer"
          onClick={() => setFilters({ name: "", email: "", address: "" })}
        >
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-gray-200 shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-6 py-3 text-left text-gray-600 font-medium tracking-wide">
                Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-gray-600 font-medium tracking-wide">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-gray-600 font-medium tracking-wide">
                Address
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-gray-600 font-medium tracking-wide">
                Avg Rating
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="animate-spin text-gray-400 mx-auto" size={24} />
                </TableCell>
              </TableRow>
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store) => {
      
                return (
                  <TableRow
                    key={store.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">
                      {store.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {store.owner.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {store.address}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-yellow-600 font-semibold">
                      {store.averageRating ? store.averageRating.toFixed(1) : "N/A"} ★
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500 select-none"
                >
                  No stores found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StoreList;
