// main - MARSISCA - BEGIN 2025-10-11
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  onUserIconClick(): void {
    console.log('User icon clicked - Login functionality to be implemented');
  }
}
// main - MARSISCA - END 2025-10-11
