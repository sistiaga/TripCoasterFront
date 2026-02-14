// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  productLinks = [
    { label: 'FOOTER.PRODUCT.FEATURES', href: '#features' },
    { label: 'FOOTER.PRODUCT.MOBILE_APP', href: '#' },
  ];

  companyLinks = [
    { label: 'FOOTER.COMPANY.ABOUT_US', href: '#' },
    { label: 'FOOTER.COMPANY.CONTACT', href: '#' }
  ];

  legalLinks = [
    { label: 'FOOTER.LEGAL.LEGAL_NOTICE', route: '/legal-notice' },
    { label: 'FOOTER.LEGAL.PRIVACY', href: '#' },
    { label: 'FOOTER.LEGAL.COOKIES', href: '#' }
  ];

  socialLinks = [
    { label: 'Instagram', href: '#' },
    { label: 'X', href: '#' },
    { label: 'YouTube', href: '#' }
  ];
}
// feature/landing-page - MARSISCA - END 2026-02-13
