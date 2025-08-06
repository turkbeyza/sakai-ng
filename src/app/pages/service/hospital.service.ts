import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface InventoryStatus {
    label: string;
    value: string;
}

export interface HospitalModel {
    phone: any;
    address: any;
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?:number,
    category?:string,
    quantity?:number,
    inventoryStatus?:string,
    rating?:number

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
    
    getProductsData() {
        return [
            
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
            
            },
           
        ];
    }

    getProductsWithOrdersData() {
        return [
            {     
            }
        ];
    }
    
    
    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    productNames: string[] = [ ];

    constructor(private http: HttpClient) {}

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    }

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    }

    getProducts() {
        return Promise.resolve(this.getProductsData());
    }

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    }

    

    generateId() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299) + 1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75) + 1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    updateHospitalById(id: string, hospital: HospitalModel): Observable<any> {
        // Eğer diğer metodlarınızda da özel header yoksa:
        return this.http.put(`${this.apiUrl}/hospitals/${id}`, hospital);
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5) + 1);
    }
}
