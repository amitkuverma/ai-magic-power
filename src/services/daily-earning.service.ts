import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DailyEarningService {
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    createDailyEarning(body: any): Observable<any> {
        body.userId = this.cookiesService.decodeToken().userId;        
        body.userName = this.cookiesService.decodeToken().userName;
        return this.http.post(`${environment.API_URL}/daily-earnings`, body);
        
    }

    getAllDailyEarning(): Observable<any> {                
        return this.http.get(`${environment.API_URL}/daily-earnings`);
    }

    getDailyEarningById(id:any): Observable<any> {                
        return this.http.get(`${environment.API_URL}/daily-earnings/${id}`);
    }

    getDailyEarningByUserId(userId:any): Observable<any> {                
        return this.http.get(`${environment.API_URL}/daily-earnings/user/${userId}`);
    }
    
    updateDailyEarning(body:any, id:any): Observable<any> {                
        return this.http.put(`${environment.API_URL}/daily-earnings/${id}`, body);
    }
}
