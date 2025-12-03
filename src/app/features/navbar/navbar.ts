import { Component } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Close menu when a link is clicked (for mobile)
  closeMenu(): void {
    this.menuOpen = false;
  }

}
