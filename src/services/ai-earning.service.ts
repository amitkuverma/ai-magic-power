import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AIEarningService {
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    createAiEarning(body: any): Observable<any> {
        body.userId = this.cookiesService.decodeToken().userId;        
        body.userName = this.cookiesService.decodeToken().userName;
        return this.http.post(`${environment.API_URL}/ai-earnings`, body);
        
    }

    getAllAiEarning(): Observable<any> {                
        return this.http.get(`${environment.API_URL}/ai-earnings`);
    }

    getAiEarningById(id:any): Observable<any> {                
        return this.http.get(`${environment.API_URL}/ai-earnings/${id}`);
    }

    getAiEarningByUserId(userId:any): Observable<any> {                
        return this.http.get(`${environment.API_URL}/ai-earnings/user/${userId}`);
    }
    
    updateAiEarning(body:any, id:any): Observable<any> {                
        return this.http.put(`${environment.API_URL}/ai-earnings/${id}`, body);
    }
}
