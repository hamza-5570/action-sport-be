"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"; // ShadCN Dialog
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Brand } from "@/types/products/products"; // Interface Brand
import {
  addBrand,
  editBrand,
  deleteBrand,
  listBrands,
} from "@/lib/actions/brands.actions";

// Fonction pour valider une URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const BrandsList = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({});
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les marques depuis la base de données
  useEffect(() => {
    async function fetchBrands() {
      const response = await listBrands();
      if (response.success) {
        setBrands(response.data);
        setFilteredBrands(response.data);
      } else {
        console.error(response.error);
      }
    }

    fetchBrands();
  }, []);

  // Filtrer les marques en fonction du terme de recherche
  useEffect(() => {
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  }, [searchTerm, brands]);

  // Ajouter une nouvelle marque
  const handleAddBrand = async () => {
    if (newBrand.name) {
      if (newBrand.websiteUrl && !isValidUrl(newBrand.websiteUrl)) {
        alert("Please enter a valid URL for the website.");
        return;
      }

      const response = await addBrand({ ...newBrand, isActive: true } as Brand); // Par défaut, isActive est true
      if (response.success) {
        setBrands((prev) => [
          ...prev,
          { ...newBrand, _id: response.insertedId, isActive: true } as Brand,
        ]);
        setNewBrand({});
        setIsDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Modifier une marque existante
  const handleEditBrand = async () => {
    if (editingBrand) {
      if (editingBrand.websiteUrl && !isValidUrl(editingBrand.websiteUrl)) {
        alert("Please enter a valid URL for the website.");
        return;
      }

      const response = await editBrand(editingBrand._id, editingBrand);
      if (response.success) {
        setBrands((prev) =>
          prev.map((brand) =>
            brand._id === editingBrand._id ? editingBrand : brand
          )
        );
        setEditingBrand(null); // Réinitialiser l'état
        setIsEditDialogOpen(false); // Fermer la boîte de dialogue
      } else {
        console.error(response.error);
      }
    }
  };

  // Supprimer une marque
  const handleDeleteBrand = async () => {
    if (brandToDelete) {
      const response = await deleteBrand(brandToDelete._id);
      if (response.success) {
        setBrands((prev) =>
          prev.filter((brand) => brand._id !== brandToDelete._id)
        );
        setBrandToDelete(null);
        setIsDeleteDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Brands</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le filtre global
            className="w-1/3"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Brand</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Brand</DialogTitle>
              <Input
                placeholder="Brand Name"
                value={newBrand.name || ""}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, name: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Image URL"
                value={newBrand.websiteUrl || ""}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, websiteUrl: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Categories (comma-separated)"
                value={newBrand.categories?.join(", ") || ""}
                onChange={(e) =>
                  setNewBrand({
                    ...newBrand,
                    categories: e.target.value
                      .split(",")
                      .map((cat) => cat.trim()),
                  })
                }
                className="mb-4"
              />
              <Input
                type="checkbox"
                checked={newBrand.isActive || false}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, isActive: e.target.checked })
                }
                className="mb-4"
              />
              <label className="ml-2">Active</label>
              <Button onClick={handleAddBrand}>Save</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Categories</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Active</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((brand) => (
            <tr key={brand._id}>
              <td className="border border-gray-300 p-2">{brand.name}</td>
              <td className="border border-gray-300 p-2">
                {brand.categories?.join(", ") || "No categories available"}
              </td>
              <td className="border border-gray-300 p-2">
                {isValidUrl(brand.websiteUrl || "/vercel.svg") ? (
                  <Image
                    src={brand.websiteUrl || "/vercel.svg"}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span>Invalid URL</span>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {brand.isActive ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingBrand(brand);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setBrandToDelete(brand);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Brand</DialogTitle>
          {editingBrand && (
            <>
              <Input
                placeholder="Brand Name"
                value={editingBrand.name || ""}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, name: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Image URL"
                value={editingBrand.websiteUrl || ""}
                onChange={(e) =>
                  setEditingBrand({
                    ...editingBrand,
                    websiteUrl: e.target.value,
                  })
                }
                className="mb-4"
              />
              <Input
                placeholder="Categories (comma-separated)"
                value={editingBrand.categories?.join(", ") || ""}
                onChange={(e) =>
                  setEditingBrand({
                    ...editingBrand,
                    categories: e.target.value
                      .split(",")
                      .map((cat) => cat.trim()),
                  })
                }
                className="mb-4"
              />
              <Input
                type="checkbox"
                checked={editingBrand.isActive || false}
                onChange={(e) =>
                  setEditingBrand({
                    ...editingBrand,
                    isActive: e.target.checked,
                  })
                }
                className="mb-4"
              />
              <label className="ml-2">Active</label>
              <Button onClick={handleEditBrand}>Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>
            Are you sure you want to delete the brand {brandToDelete?.name}?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)} // Annuler la suppression
            >
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrand}>
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandsList;
