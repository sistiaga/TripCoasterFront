// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';
import { feature } from 'topojson-client';

interface MapStat {
  icon: string;
  valueKey: string;
  labelKey: string;
  sublabelKey: string;
}

@Component({
  selector: 'app-landing-world-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './landing-world-map.component.html',
  styleUrl: './landing-world-map.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LandingWorldMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private geoJsonLayer!: L.GeoJSON;
  hoveredCountry: string | null = null;

  readonly VISITED_COUNTRY_IDS = new Set([
    '724', '250', '380', '620', '826', '276', '300', '392', '764', '484', '840', '504'
  ]);

  readonly VISITED_COUNTRY_NAMES: Record<string, string> = {
    '724': 'Spain',
    '250': 'France',
    '380': 'Italy',
    '620': 'Portugal',
    '826': 'United Kingdom',
    '276': 'Germany',
    '300': 'Greece',
    '392': 'Japan',
    '764': 'Thailand',
    '484': 'Mexico',
    '840': 'United States',
    '504': 'Morocco'
  };

  visitedCountryList = Object.values(this.VISITED_COUNTRY_NAMES);

  stats: MapStat[] = [
    { icon: 'public', valueKey: 'LANDING.MAP.STAT1_VALUE', labelKey: 'LANDING.MAP.STAT1_LABEL', sublabelKey: 'LANDING.MAP.STAT1_SUB' },
    { icon: 'flag', valueKey: 'LANDING.MAP.STAT2_VALUE', labelKey: 'LANDING.MAP.STAT2_LABEL', sublabelKey: 'LANDING.MAP.STAT2_SUB' },
    { icon: 'flight', valueKey: 'LANDING.MAP.STAT3_VALUE', labelKey: 'LANDING.MAP.STAT3_LABEL', sublabelKey: 'LANDING.MAP.STAT3_SUB' },
    { icon: 'place', valueKey: 'LANDING.MAP.STAT4_VALUE', labelKey: 'LANDING.MAP.STAT4_LABEL', sublabelKey: 'LANDING.MAP.STAT4_SUB' }
  ];

  progressPercent = 6.2;
  visitedCount = 12;
  totalCountries = 195;

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    const container = this.mapContainer.nativeElement;
    container.style.backgroundColor = '#f0ebe6';

    const canvasRenderer = L.canvas({ padding: 1, tolerance: 0 });

    this.map = L.map(container, {
      center: [25, 15],
      zoom: 2,
      minZoom: 1,
      maxZoom: 5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
      preferCanvas: true,
      renderer: canvasRenderer
    });

    // Remove all default panes that can cause grid artifacts
    const tilePanes = container.querySelectorAll('.leaflet-tile-pane, .leaflet-tile-container');
    tilePanes.forEach((el: HTMLElement) => el.style.display = 'none');

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.loadGeoJson();
  }

  private async loadGeoJson(): Promise<void> {
    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
      );
      const topoData = await response.json();
      const objectName = Object.keys(topoData.objects)[0];
      const geoData = feature(topoData, topoData.objects[objectName]);

      this.geoJsonLayer = L.geoJSON(geoData as any, {
        coordsToLatLng: (coords: any) => {
          let lng = coords[0];
          let lat = coords[1];

          // Fix antimeridian wrapping
          if (lng > 180) lng -= 360;
          if (lng < -180) lng += 360;

          // Clamp latitudes to Web Mercator limits
          if (lat > 85.05) lat = 85.05;
          if (lat < -85.05) lat = -85.05;

          return L.latLng(lat, lng);
        },
        style: (feat: any) => {
          const countryId = feat?.id || feat?.properties?.id;
          const isVisited = this.VISITED_COUNTRY_IDS.has(String(countryId));
          return {
            fillColor: isVisited ? '#FF7F00' : '#E8E0DA',
            fillOpacity: isVisited ? 0.85 : 0.6,
            color: '#FFFFFF',
            weight: 0.5,
            opacity: 1
          };
        },
        onEachFeature: (feat: any, layer: L.Layer) => {
          const countryId = feat?.id || feat?.properties?.id;
          const isVisited = this.VISITED_COUNTRY_IDS.has(String(countryId));

          if (isVisited) {
            (layer as any).on({
              mouseover: () => {
                this.hoveredCountry = this.VISITED_COUNTRY_NAMES[String(countryId)] || feat.properties?.name || null;
                (layer as any).setStyle({
                  fillColor: '#C85A00',
                  fillOpacity: 1
                });
              },
              mouseout: () => {
                this.hoveredCountry = null;
                this.geoJsonLayer.resetStyle(layer as any);
              }
            });
          }
        }
      }).addTo(this.map);

      setTimeout(() => this.map.invalidateSize(), 200);
    } catch (error) {
      console.error('Failed to load world map data:', error);
    }
  }
}
// feature/landing-page - MARSISCA - END 2026-02-13
