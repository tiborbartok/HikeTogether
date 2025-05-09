import { Component, inject, OnInit, signal } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from './menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFirestoreModule, MenubarComponent, RouterModule],
  templateUrl: 'app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = signal('HikeTogether');
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user){
        this.authService.currentUserSignal.set({
          email: user.email!,
          username: user.displayName!,
          photoURL: user.photoURL!,
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }
}
