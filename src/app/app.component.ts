/* 
  ===================================================================
  COMPOSANT ROOT - COMPOSANT PRINCIPAL DE L'APPLICATION
  ===================================================================
  
  Description :
  Composant racine de l'application.
  Point d'entrée de l'application Angular, chargé au démarrage.
  
  Responsabilités :
  - Initialisation de l'application
  - Chargement des données olympiques au démarrage
  - Gestion du cycle de vie global de l'application
  
  Architecture :
  Ce composant est le parent de tous les autres composants.
  Il orchestre le chargement initial des données via le service OlympicService.
  
  Note importante :
  Le chargement des données ici garantit qu'elles sont disponibles
  avant que l'utilisateur n'accède à n'importe quelle page de l'application.
  ===================================================================
*/

import { Component, OnInit} from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string | undefined;

  constructor(private olympicService: OlympicService) {}

  /* 
  Méthode qui charge les données et retourne un Observable
  .pipe(take(1)) permet de limiter l'observable à 1 émission
  .subscirbe() déclenche l'exécution de l'observable
  */
  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
  