import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientModel } from '../Patient/patient_model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:5077/api/User';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<PatientModel[]> {
    return this.http.get<PatientModel[]>(`${this.apiUrl}/patients`);
  }

  addPatient(patient: PatientModel): Observable<any> {
    const patientWithType = { ...patient, type: 'Patient' };
    return this.http.post(`${this.apiUrl}`, patientWithType);
  }

  updatePatient(patient: PatientModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${patient.id}`, patient);
  }

  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
