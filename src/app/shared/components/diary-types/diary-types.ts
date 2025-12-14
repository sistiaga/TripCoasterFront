// master - MARSISCA - BEGIN 2025-11-30
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { DiaryType } from '../../../core/models/diary-type.model';
import { DiaryTypeService } from '../../../core/services/diary-type.service';
import { AuthService } from '../../../core/services/auth.service';
import { DiaryTypeFormModal } from '../diary-type-form-modal/diary-type-form-modal';

@Component({
  selector: 'app-diary-types',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './diary-types.html',
  styleUrl: './diary-types.scss'
})
export class DiaryTypes implements OnInit, OnDestroy {
  diaryTypes: DiaryType[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private diaryTypeService: DiaryTypeService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDiaryTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDiaryTypes(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.diaryTypeService
      .getUserDiaryTypes(currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.diaryTypes = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading diary types:', error);
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DiaryTypeFormModal, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiaryTypes();
      }
    });
  }

  openEditDialog(diaryType: DiaryType): void {
    const dialogRef = this.dialog.open(DiaryTypeFormModal, {
      width: '500px',
      data: { diaryType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiaryTypes();
      }
    });
  }

  deleteDiaryType(diaryType: DiaryType): void {
    if (confirm(`Are you sure you want to delete "${diaryType.name}"?`)) {
      this.diaryTypeService
        .deleteDiaryType(diaryType.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadDiaryTypes();
            }
          },
          error: (error) => {
            console.error('Error deleting diary type:', error);
          }
        });
    }
  }
}
// master - MARSISCA - END 2025-11-30
