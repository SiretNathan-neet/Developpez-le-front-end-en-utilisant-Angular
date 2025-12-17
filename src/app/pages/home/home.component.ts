/* 
  ===================================================================
  COMPOSANT HOME - LOGIQUE MÉTIER
  ===================================================================
  
  Description :
  Composant Angular gérant la page d'accueil de l'application.
  Responsable du calcul et de l'affichage des statistiques de tous les olympiques de la base de données.
  
  Fonctionnalités principales :
  - Récupération des données olympiques via le service OlympicService
  - Calcul du nombre de Jeux Olympiques dans la base de données
  - Calcul du nombre de pays participants
  - Gestion du cycle de vie du composant et nettoyage des observables
  
  Architecture :
  - Utilise RxJS pour la gestion asynchrone des données
  - Implémente OnInit pour l'initialisation
  - Implémente OnDestroy pour le nettoyage des ressources liées à l'observable
  ===================================================================
*/
import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

/* 
  Type personnalisé pour représenter un pays olympique
  Définit qu'OlympicCountry est un élément du tableau Olympic
*/
type OlympicCountry = Olympic [0]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {

  /* 
    Permet au composant parent d'accéder aux propriétés et méthodes
    du graphique si nécessaire
    Le "!" indique à TypeScript que cette propriété sera initialisée
  */
  @ViewChild(PieChartComponent) pieChart!: PieChartComponent;

  numberOfJOs: number = 0;
  numberOfCountries: number = 0;

  /* 
  Subject RxJS pour gérer la destruction des observables
  Permet d'emettre une valeur lors de la destruction du composant 
  pour désabonner automatiquement tous les observables
  */
  private destroy$ = new Subject<void>();

  //Injection du service OlympicService pour accéder aux données
  constructor(private olympicService: OlympicService){}

  /* 
  Fonctionnement : 
  Récupère les données grâce à l'abonnement à l'observable
  désabonnement automatique
  Calcul des statistiques une fois les données reçues 
  et après vérification qu'elles existent
  */
  ngOnInit(): void {
    this.olympicService.getOlympics()
    .pipe(takeUntil(this.destroy$)).subscribe(olympics => {
      if(olympics) {
        this.calculateStatistics(olympics)
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
  Méthode qui prend en paramètre un tableau des pays et de leurs participations
  calcul du nombre de pays (taille du tableau)
  calcul du nombre de jo (années uniques de participation)
  Set<>() : garanti l'unicité des années
  */ 
  private calculateStatistics(countries: OlympicCountry[]): void {
    
    this.numberOfCountries = countries.length;
    const uniqueYears = new Set<number>();

    countries.forEach(country => {
      country.participations.forEach(participation => {
        uniqueYears.add(participation.year);
      });
    });
    
    this.numberOfJOs = uniqueYears.size;
  }

  numberOfOlympics(): number {
    return this.numberOfJOs;
  }

  numberOfCountry(): number {
    return this.numberOfCountries;
  }
}



