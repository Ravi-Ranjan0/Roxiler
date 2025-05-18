"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [rating, setRating] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const selectedStore = stores.find((store) => store.id === selectedStoreId) || null;

  const handleRatingSubmit = async () => {
    if (!selectedStore || !rating) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to rate a store.");
        setIsSubmitting(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/ratings`,
        {
          storeId: selectedStore.id,
          rating: parseInt(rating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === selectedStore.id
            ? { ...store, userRating: parseInt(rating) }
            : store
        )
      );

      setSelectedStoreId(null);
      setRating("");
      alert("Rating submitted successfully.");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Failed to submit rating. Maybe you already rated?"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                const currentUserId = localStorage.getItem("userId");
                const isOwner = currentUserId === store.owner.id;

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
                    <TableCell className="px-6 py-4 whitespace-nowrap text-yellow-600 font-semibold">
                      {store.userRating ? store.userRating + " ★" : "Not Rated"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {isOwner ? (
                        <span className="text-gray-400 italic text-sm select-none">
                          Cannot rate own store
                        </span>
                      ) : (
                        <Dialog
                          open={selectedStoreId === store.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setSelectedStoreId(null);
                              setRating("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedStoreId(store.id);
                                setRating(store.userRating?.toString() || "");
                              }}
                            >
                              {store.userRating ? "Edit Rating" : "Rate"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-2xl max-w-sm mx-auto p-6">
                            <DialogHeader>
                              <h2 className="text-xl font-semibold text-center mb-6">
                                Rate{" "}
                                <span className="text-indigo-600">{store.name}</span>
                              </h2>
                            </DialogHeader>
                            <div className="space-y-5">
                              <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Choose rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((val) => (
                                    <SelectItem key={val} value={val.toString()}>
                                      {val} Star{val > 1 && "s"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                className="w-full h-12"
                                onClick={handleRatingSubmit}
                                disabled={isSubmitting || !rating}
                              >
                                {isSubmitting ? "Submitting..." : "Submit Rating"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
