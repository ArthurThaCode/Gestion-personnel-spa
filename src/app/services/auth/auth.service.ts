import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Utilisateur } from '../../models/utilisateur.model'; // Mettez à jour ce chemin en fonction de l'emplacement de votre modèle

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/utilisateur/connexion';
  private registerUrl = 'http://localhost:8080/api/utilisateur/inscription';

  constructor(private http: HttpClient, private router: Router) {} // Injecter Router

  inscription(utilisateur: Utilisateur): Observable<boolean> {
    return this.http.post<any>(this.registerUrl, utilisateur).pipe(
      map((response) => {
        console.log("Réponse de l'API d'inscription :", response);
        console.log("Contenu de response.success:", response?.success);
        if (response && response.success) {
          this.router.navigate(['/Connexion']);
          return true;
        }
        console.log(" BAD:");
        return false;
      }),
      catchError((error) => {
        console.error("Erreur lors de l'inscription :", error);
        return of(false); // Renvoyer false en cas d'erreur
      })
    );
  }

  connexion(username: string, password: string): Observable<boolean> {
    const loginData = { username, password };
    return this.http.post<any>(this.loginUrl, loginData).pipe(
      map((response) => {
        if (response && response.token) {
          sessionStorage.setItem('authToken', response.token); // Stocker dans sessionStorage
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('authToken'); // Supprimer le token lors de la déconnexion
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken'); // Récupérer le token depuis sessionStorage
  }
}
