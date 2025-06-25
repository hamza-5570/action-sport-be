"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"; // ShadCN Dialog
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Product } from "@/types/products/products"; // Interface Product
import {
  addProduct,
  editProduct,
  deleteProduct,
  listProducts,
} from "@/lib/actions/products.action"; // Actions for products

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les produits depuis la base de données
  useEffect(() => {
    async function fetchProducts() {
      const response = await listProducts();
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        console.error(response.error);
      }
    }

    fetchProducts();
  }, []);

  // Filtrer les produits en fonction du terme de recherche
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.Designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  }, [searchTerm, products]);

  // Ajouter un nouveau produit
  const handleAddProduct = async () => {
    if (newProduct.Designation) {
      const response = await addProduct(newProduct as Product);
      if (response.success) {
        setProducts((prev) => [
          ...prev,
          { ...newProduct, _id: response.insertedId } as Product,
        ]);
        setNewProduct({});
        setIsDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Modifier un produit existant
  const handleEditProduct = async () => {
    if (editingProduct) {
      const response = await editProduct(editingProduct._id.toString(), editingProduct);
      if (response.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingProduct._id ? editingProduct : product
          )
        );
        setEditingProduct(null); // Réinitialiser l'état
        setIsEditDialogOpen(false); // Fermer la boîte de dialogue
      } else {
        console.error(response.error);
      }
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      const response = await deleteProduct(productToDelete._id.toString());
      if (response.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productToDelete._id)
        );
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search by Designation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le filtre global
            className="w-1/3"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Product</DialogTitle>
              <Input
                placeholder="Designation"
                value={newProduct.Designation || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, Designation: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Category"
                value={newProduct.Categorie || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, Categorie: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Price"
                type="number"
                value={newProduct.prixNet || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    prixNet: parseFloat(e.target.value),
                  })
                }
                className="mb-4"
              />
              <Button onClick={handleAddProduct}>Save</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Designation</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product._id.toString()}>
              <td className="border border-gray-300 p-2">
                {product.Designation}
              </td>
              <td className="border border-gray-300 p-2">{product.Categorie}</td>
              <td className="border border-gray-300 p-2">{product.prixNet}</td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setProductToDelete(product);
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
          <DialogTitle>Edit Product</DialogTitle>
          {editingProduct && (
            <>
              <Input
                placeholder="Designation"
                value={editingProduct.Designation || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    Designation: e.target.value,
                  })
                }
                className="mb-4"
              />
              <Input
                placeholder="Category"
                value={editingProduct.Categorie || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    Categorie: e.target.value,
                  })
                }
                className="mb-4"
              />
              <Input
                placeholder="Price"
                type="number"
                value={editingProduct.prixNet || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    prixNet: parseFloat(e.target.value),
                  })
                }
                className="mb-4"
              />
              <Button onClick={handleEditProduct}>Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>
            Are you sure you want to delete the product 
            {productToDelete?.Designation}?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)} // Annuler la suppression
            >
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsList;