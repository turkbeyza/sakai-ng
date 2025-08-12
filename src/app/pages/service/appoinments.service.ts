import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentsModel } from '../Appointments/appointments_model';


interface InventoryStatus {
    label: string;
    value: string;
}


@Injectable({
    providedIn: 'root' 
  })

export class AppointmentsService {
    httpClient: any;

    
    getAppointments() {
        Observable<any> 
        return this.http.get('http://localhost:5077/api/appointment');
    }

    deleteAppointments(id:string | undefined) {
        Observable<any> 
        return this.http.delete('http://localhost:5077/api/appointment/'+ id);
    }
    addAppointments(appointments: any): Observable<any> {
        return this.http.post<any>('http://localhost:5077/api/appointment', appointments);
      }

      updateAppointments(appointments: AppointmentsModel): Observable<any> {
        return this.http.put(`http://localhost:5077/api/appointment/${appointments.id}`, appointments);
        
      }      
    
    apiUrl(apiUrl: any): Observable<any> {
        throw new Error('Method not implemented.');
    }


    constructor(private http: HttpClient) {}

}
