/* 
  ===================================================================
  MODULE DE ROUTAGE - CONFIGURATION DES ROUTES DE L'APPLICATION
  ===================================================================
  
  Description :
  Module Angular définissant toutes les routes (URLs) de l'application.
  Configure la navigation entre les différentes pages.
  
  Architecture de navigation :
  1. Page d'accueil (/) : Vue d'ensemble avec le pie chart
  2. Page de détails (/Details/:id) : Détails d'un pays spécifique
  3. Page 404 (**) : Gestion des URLs invalides
  
  Fonctionnement :
  Angular Router intercepte les changements d'URL et affiche le composant correspondant.
  ===================================================================
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailsComponent } from './pages/details/details.component';

/*
Configuration des routes de l'application : 
type Routes : tableau d'objets définissant toutes les routes
Un objet est composé de : 
1. path : le chemin URL
2. component : le composant Angular à afficher

Attention, les routes sont évaluées dans l'ordre de déclaration
La route '**' doit toujours être en dernier
*/
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path : 'Details/:id', component: DetailsComponent}, // le :id sert à récupérer l'id de la partie du graphe sur laquelle l'utilisateur a cliqué
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
