/* 
  ===================================================================
  COMPOSANT LINE-CHART - LOGIQUE MÉTIER
  ===================================================================
  
  Description :
  Composant Angular gérant le line chart affichant l'évolution
  des médailles olympiques d'un pays spécifique au fil des années.
  
  Fonctionnalités principales :
  - Récupération dynamique de l'ID du pays depuis l'URL
  - Chargement et transformation des données olympiques pour le graphique
  - Configuration visuelle du line chart (axes, labels, timeline)
  - Affichage de l'évolution temporelle des médailles
  
  Technologies utilisées :
  - @swimlane/ngx-charts pour le rendu graphique
  - RxJS pour la gestion asynchrone et combinaison des flux de données
  - Angular Router pour la récupération des paramètres de l'URL
  
  Architecture :
  - Composant standalone
  - Implémente OnInit et OnDestroy pour le cycle de vie
  - Utilise combineLatest pour synchroniser route et données

  ===================================================================
*/

import { OlympicService } from 'src/app/core/services/olympic.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CountUpDirective, LineChartModule, ScaleType } from '@swimlane/ngx-charts';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, map, take } from 'rxjs/operators';

/*
Interface définissant la structure d'un point de données dans la série
*/
interface LineData{
  name: string;
  value: number;
}

/*
Interface définissant la structure complète des données du graphique
*/
interface LineChartData{
  name: string;
  series: LineData[];
}

/* 
Typage personnalisé représentant un pays individuel avec ses participations
*/
type OlympicCountry = {
  id: number;
  country: string;
  participations: Array<{
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
  }>;
};

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [LineChartModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})

export class LineChartComponent implements OnInit, OnDestroy {

  /* Initialisation du graphique au format LineChartData */
  dataLine: LineChartData[] = [];

  /* Option de configuration du graphique */
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Année';
  yAxisLabel: string = 'Médailles';
  timeline: boolean = true;

  colorScheme = {
    domain: ['rgb(0, 165, 184)'],
    name: '',
    selectable: false,
    group: ScaleType.Ordinal
  };

  /* Subject RxJS pour la gestion et la destruction des observables */
  private destroy$ = new Subject<void>();

  constructor(private olympicService: OlympicService, 
              private routeID: ActivatedRoute) { }

  /* Initialisation du composant et chargement des données depuis l'URL et le service */
  ngOnInit(): void{
    this.loadLineChartData();
  }

  /* 
  .next : déclenche le désabonnement utilisant takeUntil
  .complete : Libère les ressources et indique qu'aucune nouvelle valeur ne sera émise
  */
  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
  Méthode de chargement des données du graphique
  
  Fonctionnement :
  1. .combineLatest(): combine deux flux de données
  2. .takeUntil(): se désabonne automatiquement à la destruction du composant
  3. .filter(): vérifie que l'ID du pays et les données olympiques existent
  4. .map(): extrait l'ID du pays et recherche ses informations dans les données
  5. .subscribe(): traite le résultat et transforme les données pour le graphique
  */
  private loadLineChartData(): void { 
    combineLatest([this.routeID.params,
      this.olympicService.getOlympics()
    ]).pipe(
      takeUntil(this.destroy$),
      filter(([params, olympics]) => !!params['id'] && !!olympics),
      map(([params, olympics]) => {
        const countryID = params['id'];
        const countries = olympics;

        const country = countries?.find(
          (c: OlympicCountry) => c.country === countryID
        );
        return { countryID, country};
      })
    ).subscribe(({ countryID, country}) => {
      if (country) {
        this.dataLine = [this.transformToLineChartData(countryID, country)];
      } else {
        /* Gestion du cas ou le pays n'existe pas */
        this.dataLine = [];
      }
    });
  }

  /* 
    Méthode de transformation des données olympiques vers le format LineChartData
    
    Objectif :
    1. Garder le nom du pays
    2. Extraire année et nombre de médailles de chaque participation
    3. Trier les données par année croissante
    4. Retourner un objet { name, series }
    
    .map() : transforme chaque participation en objet
    .sort() : trie les données par ordre chronologique
    parseInt() : conversion de la chaîne en nombre pour le tri numérique
  */
  private transformToLineChartData(countryName: string, country: OlympicCountry): LineChartData {
    return {
      name: countryName,
      series: country.participations
        .map(participation => ({
          name: participation.year.toString(),
          value: participation.medalsCount
        }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name)) //tri par année croissant
    };
  }
}
