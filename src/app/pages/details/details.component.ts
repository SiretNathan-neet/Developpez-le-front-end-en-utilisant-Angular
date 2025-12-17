/* 
  ===================================================================
  COMPOSANT DETAILS - LOGIQUE MÉTIER
  ===================================================================
  
  Description :
  Composant Angular gérant la page de détails d'un pays dans l'application.
  Responsable de la récupération, du calcul et de l'affichage des statistiques
  d'un pays spécifique sélectionné depuis la page d'accueil.
  
  Fonctionnalités principales :
  - Récupération du pays via le paramètre de route (URL)
  - Calcul des statistiques du pays (participations, médailles, athlètes)
  - Gestion de la navigation (retour à l'accueil, redirection si pays invalide)
  - Affichage des données dans le template
  
  Architecture :
  - Utilise RxJS avec combineLatest pour gérer plusieurs observables
  - Implémente OnInit et OnDestroy pour le cycle de vie
  - Redirection si pays non trouvé
  ===================================================================
*/

import { Observable, of, Subject, combineLatest } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil, map, filter } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartComponent } from "../line-chart/line-chart.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { participation } from 'src/app/core/models/Participation';

/* 
Type personnalisé représentant un pays olympique
Cela permet de définir la structure des données
*/

type OlympicCountry = {
  id: number;
  country: string;
  participations: participation[];
};

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [LineChartComponent, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit, OnDestroy {

  @ViewChild(LineChartComponent) lineChart!: LineChartComponent;
  
  /* L'ensemble des données statistiques qui nous sont nécessaires */
  countryName: string = '';
  entriesCount: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  /* Subject RxJS pour la destruction des observables */
  private destroy$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, 
              private olympicService: OlympicService, 
              private router: Router){}


  /* 
  Fonctionnement du composant : 
  Combine les paramètres de route et les données olympiques
  Filtre pour s'assurer que les données existent
  Recherche le pays correspondant au paramètre de l'URL
  Calcule les statistiques ou redirige si pays non trouvé
  */
  ngOnInit(): void {
    /* méthode combineLatest pour n'avoir qu'un seul abonnement au lieu de deux imbriqués */
    combineLatest([
      this.activatedRoute.params,
      this.olympicService.getOlympics()
    ]).pipe(
      takeUntil(this.destroy$),
      filter(([params, olympics]) => !!params['id'] && !!olympics), /* !! transforme la valeur en booléen */
      map(([params, olympics]) => { /* map() transforme les données */
        const countryId = params['id'];
        const countriesArray = olympics;

        const country = countriesArray?.find(
          (olympic: OlympicCountry) => olympic.country === countryId
        );

        return { countryId, country};
      })
    ).subscribe(({ countryId, country}) => {
        this.countryName = countryId;

        if(country) {
          this.calculateStatistics(country);
        } else {
          this.router.navigate(['/']);
        }
    });
  }

  /* 
  .next : déclenche le désabonnement utilisant takeUntil
  .complete : Libère les ressources et indique qu'aucune nouvelle valeur ne sera émise
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* 
  Centralisation de tous les calculs statistiques du pays
  */
  private calculateStatistics(country: OlympicCountry): void{
    this.entriesCount = country.participations.length;

    this.totalMedals = country.participations.reduce(
      (sum, participation) => sum + participation.medalsCount,
      0
    );

    this.totalAthletes = country.participations.reduce(
      (sum, participation) => sum + participation.athleteCount,
      0
    );
  }

  returnHome(){
    this.router.navigate(['/']);
  }

  displayNameCountry(): string {
    return this.countryName;
  }

  entriesNumber(): number {
    return this.entriesCount;
  }

  totalMedalsforCountry(): number {
    return this.totalMedals;
  }

  totalAthletesForCountry(): number {
    return this.totalAthletes;
  }
}