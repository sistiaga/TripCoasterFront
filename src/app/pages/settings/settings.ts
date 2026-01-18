// master - MARSISCA - BEGIN 2025-12-31
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DiaryTypes } from '../../shared/components/diary-types/diary-types';
import { Countries } from '../../shared/components/countries/countries';
import { Weathers } from '../../shared/components/weathers/weathers';
import { Sports } from '../../shared/components/sports/sports';
import { Accommodations } from '../../shared/components/accommodations/accommodations';
import { TransportationTypes } from '../../shared/components/transportation-types/transportation-types';
// master - MARSISCA - BEGIN 2026-01-18
import { Locations } from '../../shared/components/locations/locations';
import { POIs } from '../../shared/components/pois/pois';
// master - MARSISCA - END 2026-01-18

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    DiaryTypes,
    Countries,
    Weathers,
    Sports,
    Accommodations,
    TransportationTypes,
    // master - MARSISCA - BEGIN 2026-01-18
    Locations,
    POIs
    // master - MARSISCA - END 2026-01-18
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  selectedTabIndex = 0;
}
// master - MARSISCA - END 2025-12-31
