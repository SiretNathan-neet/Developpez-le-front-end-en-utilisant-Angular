/* 
  ===================================================================
  MODÈLE DE DONNÉES - PARTICIPATION
  ===================================================================
  
  Description :
  Interface définissant la structure d'une participation d'un pays à une édition des Jeux Olympiques.
  
  Rôle :
  Représente les statistiques et informations d'un pays pour une année
  olympique spécifique.
  
  Utilisation :
  - Propriété 'participations' du modèle Olympic
  - Calcul des statistiques totales (médailles, athlètes)
  - Génération des points du graphique en courbe (line chart)
  - Affichage des détails par édition olympique
  
  Relations :
  - Un pays (Olympic) possède plusieurs participations
  - Une participation appartient à un seul pays
  - Une participation correspond à une seule édition des JO
  
  ===================================================================
*/

export interface participation {
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
}