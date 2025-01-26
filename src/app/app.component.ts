import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from './menubar/menubar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFirestoreModule, MenubarComponent, RouterModule],
  templateUrl: 'app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'HikeTogether';
}
