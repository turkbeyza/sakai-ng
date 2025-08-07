import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface InventoryStatus {
    label: string;
    value: string;
}

export class HospitalModel {
    phone: any;
    address: any;
    id?: string;
    name?: string;
}

@Injectable({
    providedIn: 'root' 
  })

export class HospitalService {
    httpClient: any;

    
    getHospitals() {
        Observable<any> 
        return this.http.get('http://localhost:5077/api/Hospital');
    }

    deleteHospital(id:string | undefined) {
        Observable<any> 
        return this.http.delete('http://localhost:5077/api/Hospital/'+ id);
    }
    addHospital(hospital: any): Observable<any> {
        return this.http.post<any>('http://localhost:5077/api/Hospital', hospital);
      }

      updateHospital(hospital: HospitalModel): Observable<any> {
        return this.http.put(`http://localhost:5077/api/Hospital/${hospital.id}`, hospital);
        
      }      
    
    apiUrl(apiUrl: any): Observable<any> {
        throw new Error('Method not implemented.');
    }


    constructor(private http: HttpClient) {}

}
