/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from "mongodb";

export interface ProductStockselonSocieteMagasin {
  QteTotal: number;
  Societe: string;
  magasin: string;
}

export interface ProductStockselonSocieteMagasinTaille {
  QteTotal: number;
  Societe: string;
  magasin: string;
  ville: string;
  xTaille: string;
}

export interface Product {
  _id: ObjectId;
  reference: string; // Référence du produit
  name: string; // Nom du produit
  slug: string; // Slug unique pour le produit
  category: string; // Catégorie du produit
  image: string; // Image principale du produit
  images: string[]; // Liste des images du produit
  brand: string; // Marque du produit
  description: string; // Description du produit
  price: number; // Prix net du produit
  societe: string; // Société associée au produit
  magasin: string; // Magasin associé au produit
  listPrice: number; // Prix public du produit
  countInStock: number; // Quantité en stock
  tags: string[]; // Liste des tags associés au produit
  colors: string[]; // Liste des couleurs disponibles
  sizes: string[]; // Liste des tailles disponibles
  avgRating: number; // Note moyenne du produit
  numReviews: number; // Nombre de commentaires
  ratingDistribution: number[]; // Répartition des notes
  numSales: number; // Nombre de ventes
  isPublished: boolean; // Indique si le produit est publié
  v: number; // Version du document MongoDB
  createdAt: string; // Date de création
  updatedAt: string; // Date de mise à jour
  dernierDatePromo: string; // Dernière date de promotion
  stockselonSocieteMagasin: ProductStockselonSocieteMagasin[]; // Stock par société et magasin
  stockselonSocieteMagasinTaille: ProductStockselonSocieteMagasinTaille[]; // Stock par société, magasin et taille
  nouveaute: boolean; // Indique si le produit est une nouveauté
  promotion: boolean; // Indique si le produit est en promotion
  venteflash: boolean; // Indique si le produit est en vente flash
  blackfriday: boolean; // Indique si le produit est en promotion Black Friday
  prixpublic: number; // Prix public du produit
  escompte: number; // Escompte appliqué au produit
  prixNet: number; // Prix net après escompte
  Marque: string; // Marque du produit (redondant avec `brand`)
  Categorie: string; // Catégorie du produit (redondant avec `category`)
  xGender: string; // Genre associé au produit (e.g., "MAN", "WOMAN")
  Designation: string; // Désignation du produit (redondant avec `name`)
}
export interface Brand {
  _id: string; // Unique identifier for the brand
  name: string; // Name of the brand
  logoUrl?: string; // Optional URL to the brand's logo
  // Optional year the brand was established
  categories: string[]; // Categories of products the brand specializes in (e.g., "shoes", "apparel", "equipment")
  websiteUrl?: string; // Optional URL to the brand's official website
  isActive: boolean; // Whether the brand is currently active
}
export interface Slide {
  _id: string; // Unique identifier for the slide
  title: string; // Title of the slide
  subtitle: string; // Subtitle or description of the slide
  buttonCaption: string; // Caption for the button
  url: string; // URL to the slide's image
  link: string; // Link associated with the slide
  isPublished: boolean; // Whether the slide is published
  createdAt: string;
  buttoncaption: string; // Additional button caption (case-sensitive)
}
