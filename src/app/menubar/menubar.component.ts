import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menubar',
  imports: [RouterLink, CommonModule],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent implements OnInit {
  isLoggedIn!: boolean;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  menuVisible = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      location.reload();
    });
  }
}
