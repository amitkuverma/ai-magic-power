import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { UploadService } from 'src/services/uploadfile.service';

@Component({
  selector: 'app-ai-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-packages.component.html',
  styleUrl: './ai-packages.component.scss'
})
export class AiPackagesComponent {
  packages: any[] = [
    {
      id: 1,
      name: 'OPAL AI',
      stake: '12$ - 999$',
      commission: '0.3%',
      days: 1000
    },
    {
      id: 2,
      name: 'JASPER AI',
      stake: '1000$ - 9999$+',
      commission: '0.4%',
      days: 750
    }
  ];

  selectedPackage: any | null = null;
  successMessage: string;
  selectedImage: any;
  isImageUploaded: boolean;
  imagePreviewUrl: string | ArrayBuffer;

  constructor(private paymentService:PaymentService, private cookies:CookieService, private uploadService:UploadService) { }

  ngOnInit(): void {}

  // Handle package selection
  selectPackage(pack: any): void {
    this.selectedPackage = pack;
    console.log('Selected Package:', pack);
    // You can add further logic here, like navigating or submitting
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  submitPackage(): void {
    const body ={
      userId: this.cookies.decodeToken().userId,
      userName: this.cookies.decodeToken().userName,
      plan: this.selectedPackage.name,
      commission: this.selectedPackage.commission,
      planStartDate: Date.now,
      planEndDate: Date.now,
      status: 'new',
    }
    this.paymentService.createPayment(body).subscribe(
      res =>{
        if (this.selectedImage && res) {
          this.uploadService.uploadFile(this.selectedImage, res.payment.payId, 'payment')
            .subscribe(
              response => {
                this.successMessage = 'File uploaded successfully';
                this.isImageUploaded = true; // Mark image as uploaded
              },
              error => {
                this.successMessage = 'Error uploading file';
                console.error('Error uploading file', error);
              }
            );
        } else {
          this.successMessage = 'Error uploading file: No selected image or transaction data.';
        }

      },
      error =>{

      }
    );
  }
  // Submit selected package
  // submitPackage(): void {
  //   if (this.selectedPackage) {
  //     const body = {
  //       userId: this.cookies.decodeToken().userId,
  //       userName: this.cookies.decodeToken().userName,

  //     }
  //     this.paymentService.createPayment(body).subscribe(
  //       res => {

  //       },
  //       error =>{

  //       }
  //     )
  //     console.log('Submitting Package:', this.selectedPackage);
  //     // Add API call or logic here to handle the submission of the package
  //   }
  // }
}