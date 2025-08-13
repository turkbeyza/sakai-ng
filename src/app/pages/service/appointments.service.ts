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
    
    // API base URL'ini tanımlayın
    private apiUrl = 'http://localhost:5077/api';

    constructor(private http: HttpClient) {}

    getAppointments(): Observable<any> {
        return this.http.get(`${this.apiUrl}/appointment`);
    }

    deleteAppointments(id: string | undefined): Observable<any> {
        return this.http.delete(`${this.apiUrl}/appointment/${id}`);
    }

    addAppointments(appointments: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/appointment`, appointments);
    }

    updateAppointments(appointments: AppointmentsModel): Observable<any> {
        return this.http.put(`${this.apiUrl}/appointment/${appointments.id}`, appointments);
    }

    // Dropdown veriler için methodlar
    getPatients(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/User/patients`);
    }

    getDoctors(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/User/doctors`);
    }

    getHospitals(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/hospital`);
    }

    // Yeni appointment oluşturmak için
    createAppointment(appointment: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/appointment`, appointment);
    }
}