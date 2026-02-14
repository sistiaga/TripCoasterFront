// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginModalComponent } from '../../shared/components/login-modal/login-modal.component';
import { AuthService } from '../../core/services/auth.service';
import { LandingWorldMapComponent } from '../../shared/components/landing-world-map/landing-world-map.component';

interface Feature {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

interface Step {
  icon: string;
  number: string;
  titleKey: string;
  descriptionKey: string;
}

interface Testimonial {
  nameKey: string;
  roleKey: string;
  quoteKey: string;
  initials: string;
}

interface GalleryPhoto {
  src: string;
  altKey: string;
  labelKey: string;
  spanClass: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule, LandingWorldMapComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  features: Feature[] = [
    { icon: 'public', titleKey: 'LANDING.FEATURES.COUNTRY_MAP_TITLE', descriptionKey: 'LANDING.FEATURES.COUNTRY_MAP_DESC' },
    { icon: 'flight', titleKey: 'LANDING.FEATURES.FLIGHT_COUNTER_TITLE', descriptionKey: 'LANDING.FEATURES.FLIGHT_COUNTER_DESC' },
    { icon: 'menu_book', titleKey: 'LANDING.FEATURES.TRAVEL_DIARY_TITLE', descriptionKey: 'LANDING.FEATURES.TRAVEL_DIARY_DESC' },
    { icon: 'photo_camera', titleKey: 'LANDING.FEATURES.PHOTO_GALLERY_TITLE', descriptionKey: 'LANDING.FEATURES.PHOTO_GALLERY_DESC' },
    { icon: 'map', titleKey: 'LANDING.FEATURES.ROUTES_TITLE', descriptionKey: 'LANDING.FEATURES.ROUTES_DESC' },
    { icon: 'bar_chart', titleKey: 'LANDING.FEATURES.STATS_TITLE', descriptionKey: 'LANDING.FEATURES.STATS_DESC' }
  ];

  steps: Step[] = [
    { icon: 'person_add', number: '01', titleKey: 'LANDING.STEPS.CREATE_ACCOUNT_TITLE', descriptionKey: 'LANDING.STEPS.CREATE_ACCOUNT_DESC' },
    { icon: 'edit_note', number: '02', titleKey: 'LANDING.STEPS.REGISTER_TRIPS_TITLE', descriptionKey: 'LANDING.STEPS.REGISTER_TRIPS_DESC' },
    { icon: 'public', number: '03', titleKey: 'LANDING.STEPS.WATCH_MAP_TITLE', descriptionKey: 'LANDING.STEPS.WATCH_MAP_DESC' },
    { icon: 'share', number: '04', titleKey: 'LANDING.STEPS.SHARE_TITLE', descriptionKey: 'LANDING.STEPS.SHARE_DESC' }
  ];

  testimonials: Testimonial[] = [
    { nameKey: 'LANDING.TESTIMONIALS.T1_NAME', roleKey: 'LANDING.TESTIMONIALS.T1_ROLE', quoteKey: 'LANDING.TESTIMONIALS.T1_QUOTE', initials: 'MG' },
    { nameKey: 'LANDING.TESTIMONIALS.T2_NAME', roleKey: 'LANDING.TESTIMONIALS.T2_ROLE', quoteKey: 'LANDING.TESTIMONIALS.T2_QUOTE', initials: 'CR' },
    { nameKey: 'LANDING.TESTIMONIALS.T3_NAME', roleKey: 'LANDING.TESTIMONIALS.T3_ROLE', quoteKey: 'LANDING.TESTIMONIALS.T3_QUOTE', initials: 'AT' }
  ];

  galleryPhotos: GalleryPhoto[] = [
    { src: '/assets/images/landing/travel-1.jpg', altKey: 'LANDING.GALLERY.PHOTO1_ALT', labelKey: 'LANDING.GALLERY.PHOTO1_LABEL', spanClass: 'gallery__item--large' },
    { src: '/assets/images/landing/travel-2.jpg', altKey: 'LANDING.GALLERY.PHOTO2_ALT', labelKey: 'LANDING.GALLERY.PHOTO2_LABEL', spanClass: '' },
    { src: '/assets/images/landing/travel-3.jpg', altKey: 'LANDING.GALLERY.PHOTO3_ALT', labelKey: 'LANDING.GALLERY.PHOTO3_LABEL', spanClass: '' },
    { src: '/assets/images/landing/travel-4.jpg', altKey: 'LANDING.GALLERY.PHOTO4_ALT', labelKey: 'LANDING.GALLERY.PHOTO4_LABEL', spanClass: 'gallery__item--wide' }
  ];

  stars = Array(5);

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const lang = this.route.snapshot.data['lang'];
    if (lang) {
      this.translate.use(lang);
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  openLoginModal(): void {
    this.dialog.open(LoginModalComponent, {
      width: '450px',
      disableClose: false,
      autoFocus: true
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
// feature/landing-page - MARSISCA - END 2026-02-13
