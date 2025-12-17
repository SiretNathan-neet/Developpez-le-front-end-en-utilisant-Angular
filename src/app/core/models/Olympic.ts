/* 
  ===================================================================
  MODÈLE DE DONNÉES - OLYMPIC
  ===================================================================
  
  Description :
  Définition du type de données pour les informations olympiques de l'application.
  
  Structure :
  Type représentant un tableau de pays participants aux Jeux Olympiques,
  avec leurs statistiques et historique de participations.
  
  Utilisation :
  - Service OlympicService pour typer les données chargées depuis le JSON
  - Composants pour typer les données reçues de l'observable
  - Garantit la cohérence des données dans toute l'application
  
  ===================================================================
*/

import { participation } from "./Participation";

export type Olympic  = [
{
    id: number;
    country: string;
    participations: participation[];
}];
