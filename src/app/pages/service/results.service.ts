import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultsModel } from '../Results/results_model';


interface InventoryStatus {
    label: string;
    value: string;
}


@Injectable({
    providedIn: 'root' 
  })

export class ResultsService {
    httpClient: any;

    
    getResultss() {
        Observable<any> 
        return this.http.get('http://localhost:5077/api/Results');
    }

    deleteResults(id:string | undefined) {
        Observable<any> 
        return this.http.delete('http://localhost:5077/api/Results/'+ id);
    }
    addResults(results: any): Observable<any> {
        return this.http.post<any>('http://localhost:5077/api/Results', results);
      }

      updateResults(results: ResultsModel): Observable<any> {
        return this.http.put(`http://localhost:5077/api/Results/${results.id}`, results);
        
      }      
    
    apiUrl(apiUrl: any): Observable<any> {
        throw new Error('Method not implemented.');
    }


    constructor(private http: HttpClient) {}

}
