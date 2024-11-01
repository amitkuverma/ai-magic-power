import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    getUsers(): Observable<any> {
        return this.http.get(`${environment.API_URL}/users`);
    }

    getUserById(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/user/${userId}`);
    }

    updateUserStatus(userId: any, status: any): Observable<any> {
        const body = {
            status
        }
        return this.http.put(`${environment.API_URL}/user/${userId}/status`, body);
    }

    getUserReferrals(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/referrals/${userId}`);
    }

    getFrinfReferrals(): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-chain/${this.cookiesService.decodeToken().userId}`);
    }

    getPagentReferralChain(): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-parent/${this.cookiesService.decodeToken().userId}`);
    }
    
    getChildrenReferralChain(): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-children/${this.cookiesService.decodeToken().userId}`);
    }

    updateUserProfile(data: any): Observable<any> {
        return this.http.put(`${environment.API_URL}/user/update`, data);
    }

    // Change password
    changePassword(data: any): Observable<any> {
        return this.http.post(`${environment.API_URL}/change-password`, data);
    }

    forgotPassword(data: any): Observable<any> {
        return this.http.post(`${environment.API_URL}/forgot-password`, data);
    }

    deleteUser(userId: any): Observable<any> {
        return this.http.delete(`${environment.API_URL}/delete/${userId}`);
    }
}
