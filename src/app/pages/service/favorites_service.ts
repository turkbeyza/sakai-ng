import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesModel } from '../Favorites/favorites_model';


interface InventoryStatus {
    label: string;
    value: string;
}


@Injectable({
    providedIn: 'root' 
  })

export class FavoritesService {
    httpClient: any;

    
    getFavorites() {
        Observable<any> 
        return this.http.get('http://localhost:5077/api/Favorite');
    }

    deleteFavorites(id:string | undefined) {
        Observable<any> 
        return this.http.delete('http://localhost:5077/api/Favorite/'+ id);
    }
    addFavorites(favorite: any): Observable<any> {
        return this.http.post<any>('http://localhost:5077/api/Favorite', favorite);
      }

      updateFavorites(favorite: FavoritesModel): Observable<any> {
        return this.http.put(`http://localhost:5077/api/Favorite/${favorite.id}`, favorite);
        
      }      
    
    apiUrl(apiUrl: any): Observable<any> {
        throw new Error('Method not implemented.');
    }


    constructor(private http: HttpClient) {}

}
