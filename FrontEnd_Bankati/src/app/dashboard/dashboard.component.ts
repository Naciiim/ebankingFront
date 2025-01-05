import {ChangeDetectorRef, Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../service/Auth.service";
import {AgentService} from "../service/agent.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private authService: AuthService,
              private router: Router ,
 ) {
}
  logout() {
    console.log('Bouton Logout cliqué'); // Vérifiez que ce message s'affiche

    // Assurez-vous que logout() du service AuthService fonctionne bien
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response.message); // Vérifiez la réponse du backend

        // Effacer les éléments de session
        sessionStorage.clear();

        // Navigation après la déconnexion
        this.router.navigate(['/login1']).then(() => {
          console.log('Navigation réussie vers la page de login');
        }).catch((error) => {
          console.error('Erreur lors de la navigation', error);
        });
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }
}
