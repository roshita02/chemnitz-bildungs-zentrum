import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { School } from '../../../shared/model/school.model';
import { Kindergarden } from '../../../shared/model/kindergarden.model';
import { SocialChildProject } from '../../../shared/model/socialChildProject.model';
import { SocialTeenagerProject } from '../../../shared/model/socialTeenagerProject.model';
import { ListApiResponse } from '../../auth/model/list-api-response.model';
import { ApiResponse } from '../../auth/model/api-response.model';
import { User } from '../../../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {
    baseUrl = environment.apiURL;
    facilitiesUrl = environment.apiURL + '/facilities';

    private userChanged: Subject<void> = new Subject();
    public userChangedObs = this.userChanged.asObservable();

    constructor(private http: HttpClient) { }

    getSchoolsList(): Observable<ListApiResponse<School>> {
        return this.http.get<ListApiResponse<School>>(this.facilitiesUrl + '?school=true');
    }

    getSchoolTypeList(): Observable<ListApiResponse<any>> {
        return this.http.get<ListApiResponse<any>>(this.facilitiesUrl + '/subTypes?facilityType=school');
    }

    getSchoolWithSchoolTypeList(schoolType: string): Observable<ListApiResponse<School>> {
        return this.http.get<ListApiResponse<School>>(this.facilitiesUrl + '?school=true&subType=' + schoolType);
    }

    getKindergardensList(): Observable<ListApiResponse<Kindergarden>> {
        return this.http.get<ListApiResponse<Kindergarden>>(this.facilitiesUrl + '?kindergarten=true');
    }

    getSocialChildProjectsList(): Observable<ListApiResponse<SocialChildProject>> {
        return this.http.get<ListApiResponse<SocialChildProject>>(this.facilitiesUrl + '?socialChildProject=true');
    }

    getSocialTeenagerProjectsList(): Observable<ListApiResponse<SocialTeenagerProject>> {
        return this.http.get<ListApiResponse<SocialTeenagerProject>>(this.facilitiesUrl + '?socialTeenagerProject=true');
    }

    getSchool(id: string, userId: string): Observable<ApiResponse<School>> {
        return this.http.get<ApiResponse<School>>(this.facilitiesUrl + '/' + id + '?facilityType=school');
    }

    getKindergarden(id: string, userId: string): Observable<ApiResponse<Kindergarden>> {
        return this.http.get<ApiResponse<Kindergarden>>(this.facilitiesUrl + '/' + id + '?facilityType=kindergarten');
    }

    getSocialChildProject(id: string, userId: string): Observable<ApiResponse<SocialChildProject>> {
        return this.http.get<ApiResponse<SocialChildProject>>(this.facilitiesUrl + '/' + id + '?facilityType=socialChildProject');
    }

    getSocialTeenagerProject(id: string, userId: string): Observable<ApiResponse<SocialTeenagerProject>> {
        return this.http.get<ApiResponse<SocialTeenagerProject>>(this.facilitiesUrl + '/' + id + '?facilityType=socialTeenagerProject');
    }

    updateUserAddress(userId: string, params: any): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(this.baseUrl + '/users/updateAddress/', params);
    }

    getUser(userId: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(this.baseUrl + '/users/' + userId);
    }

    deleteUser(): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(this.baseUrl + '/users/delete');
    }

    updateUser(userId: string, params: any): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(this.baseUrl + '/users/update/', params);
    }

    addUserFavourite(userId: string, facilityId: string, facilityType: string, name: string, address: string): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(this.baseUrl + '/userFavourites/' + `?facilityId=${facilityId}&facilityType=${facilityType}`, {name: name});
    }

    deleteUserFavourite(userId: string): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(this.baseUrl + '/userFavourites/', {});
    }

    updatedUser(): void {
        this.userChanged.next();
    }
}
