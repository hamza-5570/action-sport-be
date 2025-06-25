export interface User {
  _id: string;
  email: string; // Email de l'utilisateur
  name: string; // Nom de l'utilisateur
  role: string; // Rôle de l'utilisateur (e.g., "Designer", "Admin")
  password: string; // Mot de passe hashé
  emailVerified: boolean; // Si l'email est vérifié
  createdAt: string; // Date de création
  updatedAt: string; // Date de mise à jour
  __v: number; // Version du document MongoDB
}
