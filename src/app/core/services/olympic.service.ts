/* 
  ===================================================================
  SERVICE OLYMPIC - GESTION DES DONNÉES OLYMPIQUES
  ===================================================================
  
  Description :
  Service Angular central pour la gestion des données olympiques de l'application.
  
  Fonctionnalités :
  - Chargement des données olympiques depuis le fichier JSON
  - Stockage centralisé des données dans un BehaviorSubject
  - Distribution des données à tous les composants de l'application
  - Gestion des erreurs de chargement
  
  Architecture :
  Utilise le pattern Observable avec BehaviorSubject pour :
  - Partager les mêmes données entre tous les composants
  - Éviter les chargements multiples
  - Notifier automatiquement les composants des changements
  ===================================================================
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

/*
Marque cette classe comme un service injectable Angular
providedIn: 'root' : 
1. le service est fourni au niveau racine de l'application
2. Angular cré une instance unique partagée par toute l'application
3. Tous les composants utilise la même instance
4. Pas besoin de déclarer le service dans les providers d'un module
*/
@Injectable({
  providedIn: 'root',
})

/* 
URL du fichier JSON contenant les données olympiques
BehaviorSubject stock les données olympiques
*/
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic | undefined | null>(undefined);

  /* 
  HttpClient d'Angular pour les requêtes HTTP qui permet de :
  1. faire des requpetes (GET, POST, PUT, DELETE...)
  2. Retourner des Observables
  3. Gérer automatiquement les headers et la sérialisation JSON
  4. Intercepter les requêtes (authentification, logging...)
  */
  constructor(private http: HttpClient) {} 

  loadInitialData() {
    return this.http.get<Olympic>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  /*
  Méthode pour accéder aux données olympiques
  asObservable(): Convertit le BehaviorSubject en Observable simple
  */
  getOlympics() {
    return this.olympics$.asObservable();
  }
}
