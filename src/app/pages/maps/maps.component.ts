// master - MARSISCA - BEGIN 2025-10-18
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../../shared/components/world-map/world-map.component';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, WorldMapComponent],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent {}
// master - MARSISCA - END 2025-10-18
