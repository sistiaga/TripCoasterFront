// master - MARSISCA - BEGIN 2026-01-16
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { TripLocationDetail } from '../../../core/models/location.model';
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
  selector: 'app-trip-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-map.component.html',
  styleUrl: './trip-map.component.scss'
})
export class TripMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() locations: TripLocationDetail[] = [];

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locations'] && !changes['locations'].firstChange && this.map) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    const container = this.mapContainer.nativeElement;

    // Clear any existing map instance
    if (this.map) {
      this.map.remove();
    }

    // Determine initial center and zoom based on locations
    let center: [number, number] = [20, 0];
    let zoom = 2;

    if (this.locations && this.locations.length > 0) {
      // Calculate center from all locations
      const avgLat = this.locations.reduce((sum, loc) => sum + loc.latitude, 0) / this.locations.length;
      const avgLng = this.locations.reduce((sum, loc) => sum + loc.longitude, 0) / this.locations.length;
      center = [avgLat, avgLng];
      zoom = this.locations.length === 1 ? 10 : 4;
    }

    // Create map
    this.map = L.map(container, {
      center,
      zoom,
      minZoom: 2,
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

    // Add markers
    this.updateMarkers();

    // Invalidate size
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  private updateMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add new markers
    if (this.locations && this.locations.length > 0) {
      const bounds: L.LatLngBounds = L.latLngBounds([]);

      this.locations.forEach((location, index) => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(this.map!);

        const countryName = location.country?.nameEnglish || '';
        const flagUrl = this.getFlagUrl(location.country?.flagPath);
        const flagImg = flagUrl ? `<img src="${flagUrl}" alt="${countryName}" style="width: 32px; height: 24px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 2px;"><br>` : '';

        const popupContent = `
          ${flagImg}
          <b>${location.name}</b><br>
          ${countryName ? `${countryName}<br>` : ''}
          <small>${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</small>
        `;

        marker.bindPopup(popupContent);
        this.markers.push(marker);
        bounds.extend([location.latitude, location.longitude]);
      });

      // Fit map to bounds if multiple locations
      if (this.locations.length > 1) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  private getFlagUrl(flagPath: string | undefined): string | null {
    if (!flagPath) return null;

    if (flagPath.startsWith('http://') || flagPath.startsWith('https://') || flagPath.startsWith('data:')) {
      return flagPath;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${flagPath}`;
  }
}
// master - MARSISCA - END 2026-01-16
