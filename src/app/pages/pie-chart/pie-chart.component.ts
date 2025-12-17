/* 
  ===================================================================
  COMPOSANT PIE-CHART - LOGIQUE MÉTIER DU GRAPHIQUE
  ===================================================================
  
  Description :
  Composant Angular gérant le pie chart interactif.
  de la page d'accueil de l'application.
  
  Fonctionnalités principales :
  - Récupération et transformation des données olympiques pour le graphique
  - Configuration visuelle du pie chart (couleurs, dimensions, options)
  - Gestion du redimensionnement responsive en temps réel
  - Navigation vers la page de détails au clic sur une part
  
  Technologies utilisées :
  - @swimlane/ngx-charts pour le rendu graphique SVG
  - RxJS pour la gestion asynchrone des données
  - Angular HostListener pour la détection du resize
  
  Architecture :
  - Composant standalone (Angular moderne)
  - Implémente OnInit, AfterViewInit, OnDestroy pour le cycle de vie complet
  ===================================================================
*/

import { AfterViewInit, Component, ElementRef, 
  HostListener, NgZone, 
  OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PieChartModule, Color, ScaleType, ChartCommonModule } from '@swimlane/ngx-charts'; //Ajout de NgxCharts pour les charts
import { Subject, takeUntil } from 'rxjs';
import type { Olympic } from 'src/app/core/models/Olympic'; //J'importe que le type d'Olympic
import { OlympicService } from 'src/app/core/services/olympic.service';

/* 
Interface définissant la structure des données pour le graphique
Format requis par ngx-charts-pie-chart
l'objectif est de représenter 1 élement du pie chart par un objet typescript
*/
export interface PieData {
  name: string;
  value: number;
}

/* Typage personnalisé représentant un pays individuel */
type OlympicCountry = Olympic [0]

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [PieChartModule, ChartCommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})

export class PieChartComponent implements OnInit, AfterViewInit, OnDestroy {
  
  /* Données du graphique au format PieData */
  dataPie: PieData[] = [];
  view: [number, number] = [300, 300]; /* Dimension initiale du graphique */

  /* Options de configuration du graphique */
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = {
    domain: ['#956065', '#793d52', '#89a1db', '#9780a1', '#bfe0f1'],
    name: 'olympic',
    selectable: false,
    group: ScaleType.Ordinal
  };

  /* Subject RxJS pour la gestion et la destruction des observables */
  private destroy$ = new Subject<void>();

  /* On initialise sous forme de constante les données de configuration de la taille du graphique */
  private readonly Max_Chart_Size = 600;
  private readonly Chart_Size_Ratio = 0.85;

  constructor(private olympicService: OlympicService, 
              private router: Router,
              private el: ElementRef,
              private zone: NgZone,
              private cdr: ChangeDetectorRef) {}

  /* Initialisation du composant et chargement des données depuis le service */
  ngOnInit(): void {
    this.loadOlympicData();
  }

  /* 
  Appelé après qu'Angular ait initialisé le DOM du composant
  Calcule la taille initiale du graphique selon le conteneur (responsivité)
  */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeChart();
    }, 0);
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
  Méthode de chargement des données olympiques
  vérifie que les olympics existent avant transformation
  markForCheck() : indique à Angular de vérifier le composant
  lors du prochain cycle de détection de changements
  */
  private loadOlympicData(): void {
    this.olympicService.getOlympics().pipe(takeUntil(this.destroy$))
    .subscribe(olympics => {
      if(olympics) {
        this.dataPie = this.transformToPieData(olympics);
        this.cdr.markForCheck();
      }
    });
  }

  /* 
  Méthode de transformation des données
  Objectif : 
  1. Garder le nom du pays
  2. Calculer le total de médailles
  3. Retourner un objet { name, value }

  .map(): transforme chaque élément du tableau
  .reduce(): additionne les médailles de toutes les participations

  Les paramètres : 
  1. total : accumulateur (somme en cours)
  2. participation : élément courant
  3. 0 : valeur initiale de l'accumulateur
  */
  private transformToPieData(coutnries: OlympicCountry[]): PieData[] {
    return coutnries.map(country => ({
      name: country.country,
      value: country.participations.reduce(
        (total, participation) => total + participation.medalsCount, 0)
    }));
  }

  /* 
  @HostListener écoute l'évement resize du navigateur

  Fonctionnement :
  1. L'utilisateur redimensionne la fenêtre du navigateur
  2. Détection de l'évenement 'window:resize'
  3. Appel de la méthode onResize()
  4. Redimensionnement du graphique
  */
  @HostListener('window:resize')
  onResize(): void {
    this.resizeChart();
  }


  /*
  Méthode de mise à jour de la taille du graphique
  1. Récupère la largeur du conteneur parent
  2. Applique le ratio 
  3. Limite à la taille maximale
  4. Met à jour la propriété view
  5. Force la détection du changement éventuel 

  this.el.nativeElement.parentElement?.offsetWidth :
  1. el.nativeElement : référence au DOM de <app-pie-chart>
  2. .parentElement : élément parent
  3. ?.offsetWidth : largeur en pixels
  4. || 300 : valeur par défaut si parent non disponible

  */
  private resizeChart(): void {
    const containerWidth = this.el.nativeElement.parentElement?.offsetWidth || 300;
    const size = Math.min(containerWidth * this.Chart_Size_Ratio, this.Max_Chart_Size);
    this.view = [size, size];
    this.cdr.detectChanges();
  }  

  /*
  Méthode appelée lors du clic sur une part du pie chart
  Permet de naviguer sur la page '/Details/NomDuPaysCliqué' associé
  */
  onSelect(dataPie: PieData): void {
    this.router.navigate(['/Details',dataPie.name]);
  }
}


