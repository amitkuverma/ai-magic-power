import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {
  user: any;
  editMode: boolean = false;
  selectedFile: File | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Simulating a user profile fetch. Replace with your API call.
    this.user = {
      name: 'Jane Doe',
      profession: 'Software Engineer',
      location: 'San Francisco, CA',
      bio: 'Passionate developer with 5+ years of experience...',
      projects: 34,
      followers: 1200,
      following: 350,
      image: 'https://via.placeholder.com/150', // Placeholder image
    };
  }

  // Toggle edit mode
  toggleEditMode(): void {
    if (this.editMode) {
      this.saveProfile();
    }
    this.editMode = !this.editMode;
  }

  // Save profile (you can add an API call here)
  saveProfile(): void {
    if (this.selectedFile) {
      this.uploadProfileImage(this.selectedFile);
    }
    // Add API call to save updated profile data
    console.log('Profile saved:', this.user);
  }

  // Handle file selection for profile image
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result; // Update image preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload profile image (implement API call)
  uploadProfileImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    // Call your API to upload the image
    console.log('Uploading image...');
  }
}