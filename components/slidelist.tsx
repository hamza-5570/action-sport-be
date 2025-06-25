/* eslint-disable @next/next/no-img-element */
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
import { Slide } from "@/types/products/products"; // Interface Slide
import {
  addSlide,
  editSlide,
  deleteSlide,
  listSlides,
} from "@/lib/actions/slides.action"; // Actions for slides
import { HomeCarousel } from "./home/home-carousel";

const SlidesList = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [filteredSlides, setFilteredSlides] = useState<Slide[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({});
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les slides depuis la base de données
  useEffect(() => {
    async function fetchSlides() {
      const response = await listSlides();
      console.log(response);
      if (response.success) {
        setSlides(response.data);

        setFilteredSlides(response.data);
      } else {
        console.error(response.error);
      }
    }

    fetchSlides();
  }, []);

  // Filtrer les slides en fonction du terme de recherche
  useEffect(() => {
    const filtered = slides.filter((slide) =>
      slide.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSlides(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  }, [searchTerm, slides]);

  // Gérer l'upload d'image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/uploadftp", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (editingSlide) {
          setEditingSlide((prev) => ({
            ...prev!,
            url: `/img/carousels/${result.fileName}`,
          }));
        } else {
          setNewSlide((prev) => ({
            ...prev,
            url: `/img/carousels/${result.fileName}`,
          }));
        }
        setImageFile(null); // Reset file input
      } else {
        setUploadError(result.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Ajouter un nouveau slide
  const handleAddSlide = async () => {
    if (newSlide.title) {
      const response = await addSlide({
        ...newSlide,
        isPublished: false,
      } as Slide); // Par défaut, isPublished est false
      if (response.success) {
        setSlides((prev) => [
          ...prev,
          {
            ...newSlide,
            _id: response.insertedId,
            isPublished: false,
          } as Slide,
        ]);
        setNewSlide({});
        setIsDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Modifier un slide existant
  const handleEditSlide = async () => {
    if (editingSlide) {
      const response = await editSlide(editingSlide._id, editingSlide);
      if (response.success) {
        setSlides((prev) =>
          prev.map((slide) =>
            slide._id === editingSlide._id ? editingSlide : slide
          )
        );
        setEditingSlide(null); // Réinitialiser l'état
        setIsEditDialogOpen(false); // Fermer la boîte de dialogue
      } else {
        console.error(response.error);
      }
    }
  };

  // Supprimer un slide
  const handleDeleteSlide = async () => {
    if (slideToDelete) {
      const response = await deleteSlide(slideToDelete._id);
      if (response.success) {
        setSlides((prev) =>
          prev.filter((slide) => slide._id !== slideToDelete._id)
        );
        setSlideToDelete(null);
        setIsDeleteDialogOpen(false);
      } else {
        console.error(response.error);
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSlides.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);

  return (
    <div className="p-4">
      <HomeCarousel items={slides} index={0} locale="en" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Slides</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search by Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le filtre global
            className="w-1/3"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Slide</Button>
            </DialogTrigger>
            <DialogContent>
    <DialogTitle>Add New Slide</DialogTitle>
    <Input
      placeholder="Slide Title"
      value={newSlide.title || ""}
      onChange={(e) =>
        setNewSlide({ ...newSlide, title: e.target.value })
      }
      className="mb-4"
    />
    <Input
      placeholder="Subtitle"
      value={newSlide.subtitle || ""}
      onChange={(e) =>
        setNewSlide({ ...newSlide, subtitle: e.target.value })
      }
      className="mb-4"
    />
    <Input
      placeholder="Button Caption"
      value={newSlide.buttonCaption || ""}
      onChange={(e) =>
        setNewSlide({ ...newSlide, buttonCaption: e.target.value })
      }
      className="mb-4"
    />
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploadError && <p className="text-red-500">{uploadError}</p>}
      {isUploading ? (
        <p>Uploading...</p>
      ) : (
        <Button onClick={handleUpload}>Upload Image</Button>
      )}
    </div>
    {newSlide.url && (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Uploaded Image
        </label>
        <img
          src={newSlide.url}
          alt="Uploaded Slide"
          className="w-32 h-32 object-cover mt-2"
        />
      </div>
    )}
    <Button onClick={handleAddSlide}>Save</Button>
  </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Table des slides */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Subtitle</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((slide) => (
            <tr key={slide._id}>
              <td className="border border-gray-300 p-2">{slide.title}</td>
              <td className="border border-gray-300 p-2">{slide.subtitle}</td>
              <td className="border border-gray-300 p-2">
                {slide.url ? (
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSlideToDelete(slide);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="ml-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog for Editing Slide */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Slide</DialogTitle>
          {editingSlide && (
            <>
              <Input
                placeholder="Slide Title"
                value={editingSlide.title || ""}
                onChange={(e) =>
                  setEditingSlide({ ...editingSlide, title: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Subtitle"
                value={editingSlide.subtitle || ""}
                onChange={(e) =>
                  setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                }
                className="mb-4"
              />
              <Input
                placeholder="Button Caption"
                value={editingSlide.buttonCaption || ""}
                onChange={(e) =>
                  setEditingSlide({
                    ...editingSlide,
                    buttonCaption: e.target.value,
                  })
                }
                className="mb-4"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current Image
                </label>
                {editingSlide.url ? (
                  <img
                    src={editingSlide.url}
                    alt={editingSlide.title}
                    className="w-32 h-32 object-cover mt-2"
                  />
                ) : (
                  <p className="text-gray-500">No Image Available</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploadError && <p className="text-red-500">{uploadError}</p>}
                {isUploading ? (
                  <p>Uploading...</p>
                ) : (
                  <Button onClick={handleUpload}>Upload Image</Button>
                )}
              </div>
              <Button onClick={handleEditSlide}>Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Deleting Slide */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>
            Are you sure you want to delete the slide
            {slideToDelete?.title}?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)} // Annuler la suppression
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSlide}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default SlidesList;
