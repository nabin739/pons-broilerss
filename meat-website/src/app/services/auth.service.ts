import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock user data for development
  private mockUsers = [
    {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In real app, this would be hashed
      phone: '1234567890',
      address: '123 Test Street'
    }
  ];

  constructor(private http: HttpClient) {
    // Check for stored user data on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    // Find user with matching credentials
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password from user object before storing
      const { password: _, ...safeUser } = user;
      const response = {
        user: safeUser,
        token: 'mock-jwt-token'
      };

      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(response => {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        })
      );
    }

    // Return error if credentials don't match
    return throwError(() => new Error('Invalid email or password'));
  }

  register(userData: any): Observable<any> {
    // Check if email already exists
    if (this.mockUsers.some(u => u.email === userData.email)) {
      return throwError(() => new Error('Email already registered'));
    }

    // Create new user
    const newUser = {
      id: (this.mockUsers.length + 1).toString(),
      ...userData
    };

    this.mockUsers.push(newUser);

    const { password: _, ...safeUser } = newUser;
    const response = {
      user: safeUser,
      token: 'mock-jwt-token'
    };

    return of(response).pipe(
      delay(500),
      tap(response => {
        this.currentUserSubject.next(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    // Simulate sending password reset email
    if (this.mockUsers.some(u => u.email === email)) {
      return of({ message: 'Password reset email sent' }).pipe(delay(500));
    }
    return throwError(() => new Error('Email not found'));
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    // Simulate password reset
    return of({ message: 'Password reset successful' }).pipe(delay(500));
  }

  verifyResetToken(token: string): Observable<any> {
    // Simulate token verification
    return of({ valid: true }).pipe(delay(500));
  }

  sendOTP(phone: string): Observable<any> {
    // Simulate sending OTP
    return of({ message: 'OTP sent successfully' }).pipe(delay(500));
  }

  verifyOTP(phone: string, otp: string): Observable<any> {
    // Simulate OTP verification (accept any 6-digit OTP)
    if (/^\d{6}$/.test(otp)) {
      return of({ message: 'OTP verified successfully' }).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid OTP'));
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateProfile(userData: Partial<User>): Observable<any> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    const updatedUser = { ...currentUser, ...userData };
    const response = { user: updatedUser };

    return of(response).pipe(
      delay(500),
      tap(response => {
        this.currentUserSubject.next(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }
} 