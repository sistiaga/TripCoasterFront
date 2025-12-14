// master - MARSISCA - BEGIN 2025-12-14
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DiaryTypes } from '../../shared/components/diary-types/diary-types';
import { Countries } from '../../shared/components/countries/countries';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    DiaryTypes,
    Countries
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  selectedTabIndex = 0;
}
// master - MARSISCA - END 2025-12-14
