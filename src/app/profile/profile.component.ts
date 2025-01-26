import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userEmail: string;
  
  constructor(private authService: AuthService) {
    this.userEmail = this.authService.getUserEmail();
  }

  user = {
    name: 'Unknown',
    email: 'john.doe@example.com',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg'
  };

  isEditing: boolean = false;
  updatedName: string = this.user.name;
  updatedEmail: string = this.user.email;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.user.name = this.updatedName;
    this.user.email = this.updatedEmail;
    this.toggleEdit();
  }

  changePassword() {
    alert("Password change functionality will be implemented.");
  }
}
