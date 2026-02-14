// feature/landing-page - MARSISCA - BEGIN 2026-02-14
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';
import { environment } from '../../../../environments/environment';

// Fix Leaflet icon paths
const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.scss',
  encapsulation: ViewEncapsulation.None
})
// feature/landing-page - MARSISCA - END 2026-02-14
export class WorldMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private visitedCountries: Country[] = [];

  constructor(private countryService: CountryService) {}

  ngAfterViewInit(): void {
    this.loadCountriesAndInitMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private loadCountriesAndInitMap(): void {
    this.countryService.getCountries().subscribe({
      next: (response) => {
        if (response.success) {
          this.visitedCountries = response.data;
        }
        setTimeout(() => this.initMap(), 100);
      },
      error: () => {
        setTimeout(() => this.initMap(), 100);
      }
    });
  }

  private initMap(): void {
    const container = this.mapContainer.nativeElement;

    // Clear any existing map instance
    if (this.map) {
      this.map.remove();
    }

    // Create map
    this.map = L.map(container, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
      tileSize: 256
    }).addTo(this.map);

    // Add markers for visited countries
    this.visitedCountries.forEach(country => {
      // feature/landing-page - MARSISCA - BEGIN 2026-02-14
      const marker = L.circleMarker([country.latitude, country.longitude], {
        radius: 8,
        fillColor: '#FF7F00',
        color: '#E67300',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(this.map!);
      // feature/landing-page - MARSISCA - END 2026-02-14

      const lang = localStorage.getItem('lang') || 'en';
      const countryName = lang === 'es' ? country.nameSpanish : country.nameEnglish;
      const flagUrl = this.getFlagUrl(country.flagPath);
      const flagImg = flagUrl ? `<img src="${flagUrl}" alt="${countryName}" style="width: 32px; height: 24px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 2px;"><br>` : '';

      marker.bindPopup(`${flagImg}<b>${countryName}</b><br>${country.continent}`);
    });

    // Invalidate size
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  private getFlagUrl(flagPath: string | null): string | null {
    if (!flagPath) return null;

    if (flagPath.startsWith('http://') || flagPath.startsWith('https://') || flagPath.startsWith('data:')) {
      return flagPath;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${flagPath}`;
  }
}
// master - MARSISCA - END 2026-01-02
