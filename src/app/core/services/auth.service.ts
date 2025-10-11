// main - MARSISCA - BEGIN 2025-10-11
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginCredentials {
  emailOrAlias: string;
  password: string;
}

export interface UserData {
  id: number;
  alias: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  lastAccessDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: UserData;
  error?: string;
}

export interface User {
  id: number;
  alias: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/users/login`;

    return this.http.post<LoginResponse>(apiUrl, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.id,
            alias: response.data.alias,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName
          };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(error => {
        const errorResponse = error.error;
        return of({
          success: false,
          message: errorResponse?.message || 'Error connecting to server',
          error: errorResponse?.error || 'Unable to connect to server'
        });
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) {
      return 'Sin iniciar';
    }
    return `${user.firstName} ${user.lastName}`.trim() || user.alias || user.email;
  }
}
// main - MARSISCA - END 2025-10-11
