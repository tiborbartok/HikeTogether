import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-hikes',
  imports: [CommonModule, FormsModule],
  templateUrl: './hikes.component.html',
  styleUrl: './hikes.component.scss'
})
export class HikesComponent {

  hikes = [
    { name: 'Mountain Peak', location: 'Alps', difficulty: 'Hard', description: 'A challenging climb to the top of the Alps.' },
    { name: 'River Walk', location: 'Amazon', difficulty: 'Easy', description: 'A scenic walk along the Amazon River.' },
    { name: 'Desert Adventure', location: 'Sahara', difficulty: 'Medium', description: 'Explore the vast desert dunes of the Sahara.' },
    { name: 'Forest Escape', location: 'Amazon', difficulty: 'Medium', description: 'A peaceful hike through the Amazon rainforest.' },
  ];

  searchQuery: string = '';
  filteredHikes = this.hikes;

  filterHikes() {
    this.filteredHikes = this.hikes.filter(hike =>
      hike.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  joinHike(_t7: { name: string; location: string; difficulty: string; description: string; }) {
    throw new Error('Method not implemented.');
    }
}
