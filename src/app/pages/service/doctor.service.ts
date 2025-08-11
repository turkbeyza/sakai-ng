import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorModel } from '../Doctor/doctor_model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5077/api/User';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<DoctorModel[]> {
    return this.http.get<DoctorModel[]>(`${this.apiUrl}/doctors`);
  }

  addDoctor(doctor: DoctorModel): Observable<any> {
    const doctorWithType = { ...doctor, type: 'Doctor' };
    return this.http.post(`${this.apiUrl}`, doctorWithType);
  }

  updateDoctor(doctor: DoctorModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${doctor.id}`, doctor);
  }

  deleteDoctor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
