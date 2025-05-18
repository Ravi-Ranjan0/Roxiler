"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Star } from "lucide-react";
import { getAllStores } from "@/services/store.service";

type Store = {
  id: number;
  name: string;
  address: string;
  owner: {
    id: number;
    name: string;
    email: string;
    address: string;
  };
  averageRating: number | null;
  userRating: number | null;
  ratingId: number | null;
};

const StoreList = () => {
  const [search, setSearch] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [rating, setRating] = useState<string>(""); // keep as string for Select compatibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all stores including user ratings and average ratings
  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getAllStores();
      setStores(data.data.stores);
      console.log("Fetched stores:", data.data.stores);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Controlled search input updates the search string in lowercase
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  // Filter stores by name or address match
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search) ||
      store.address.toLowerCase().includes(search)
  );

  // When dialog opens, set the rating string to existing user rating or empty
  const onOpenRatingDialog = (storeId: number, currentUserRating: number | null) => {
    setSelectedStoreId(storeId);
    setRating(currentUserRating !== null ? currentUserRating.toString() : "");
  };

  // On dialog close reset rating and selected store
  const onCloseRatingDialog = () => {
    setSelectedStoreId(null);
    setRating("");
  };

  // Handle rating submission (create or update)
  const handleRatingSubmit = async () => {
    if (!selectedStoreId || !rating) return;

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const currentStore = stores.find((s) => s.id === selectedStoreId);
      const isModify = !!currentStore?.ratingId;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/rating`, {
        method: isModify ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(
          isModify
            ? { ratingId: currentStore!.ratingId, rating: parsedRating }
            : { storeId: selectedStoreId, rating: parsedRating }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit rating");
      }

      // Refresh stores data to update average and user ratings
      await fetchStores();

      onCloseRatingDialog();
    } catch (error: any) {
      console.error("Rating error:", error);
      alert(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading stores...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800">
        Discover Local Stores
      </h1>

      <Input
        type="text"
        placeholder="🔍 Search by name or address"
        value={search}
        onChange={handleSearch}
        className="w-full rounded-lg border border-gray-300 shadow-sm"
      />

      {filteredStores.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No stores found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStores.map((store) => (
          <Card
            key={store.id}
            className="transition-transform hover:scale-[1.015] shadow-md hover:shadow-lg border border-gray-200 rounded-2xl"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary">
                {store.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{store.address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Owner: {store.owner.name} ({store.owner.email})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">
                  Average Rating:{" "}
                  {store.averageRating !== null
                    ? store.averageRating.toFixed(1)
                    : "N/A"}{" "}
                  ★
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Your Rating:{" "}
                <span className="font-semibold text-gray-900">
                  {store.userRating !== null
                    ? `${store.userRating} ★`
                    : "Not Rated"}
                </span>
              </div>

              <Dialog open={selectedStoreId === store.id} onOpenChange={(open) => !open && onCloseRatingDialog()}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => onOpenRatingDialog(store.id, store.userRating)}
                  >
                    {store.userRating !== null ? "Modify Rating" : "Submit Rating"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-sm mx-auto">
                  <DialogHeader>
                    <h2 className="text-2xl font-bold mb-4 text-center text-primary">
                      Rate {store.name}
                    </h2>
                    <p className="text-sm text-gray-700 text-center">
                      Your current rating:{" "}
                      <span className="font-semibold text-gray-900">
                        {store.userRating !== null
                          ? `${store.userRating} ★`
                          : "Not Rated"}
                      </span>
                    </p>
                  </DialogHeader>

                  <div className="space-y-2">
                    <Label>Select Rating</Label>
                    <Select value={rating} onValueChange={setRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate 1 to 5" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={val.toString()}>
                            {val} Star{val > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full mt-4"
                      onClick={handleRatingSubmit}
                      disabled={isSubmitting || !rating}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
