import { Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FavoritesList } from './favorites_list';
import { FavoritesAddUpdate } from './favorites_add_update';
import { FavoritesModel } from './favorites_model';
import { FavoritesService } from '../service/favorites_service';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    FavoritesList,
    FavoritesAddUpdate
],

    template: `<app-favorites-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
    <app-favorites-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [favoritesDialog]= 'favoritesDialog'
    (favoritesSaved)="onFavoritesSaved()" [editFavoritesData] = 'editFavoritesData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, FavoritesService, ConfirmationService]
})
export class Favorites implements OnInit {
    favoritesDialog: boolean = false;

    favoritess = signal<FavoritesModel[]>([]);

    favorites!: FavoritesModel;

    selectedProducts!: FavoritesModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(FavoritesList) favoriteslist!: FavoritesList;

    editFavoritesData!:FavoritesModel

    constructor(
        @Inject(FavoritesService) private favoritesService: FavoritesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    editEvent(favorites: FavoritesModel){
        this.editFavoritesData=favorites
    }
    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.favorites = { patientUserId: null, doctorUserId: null };
        this.submitted = false;
        this.favoritesDialog = true;
    }


    onFavoritesSaved() {
        this.favoriteslist.loadDemoData();
        this.favoritesDialog = false; 
      }
      

    editFavorites(favorites: FavoritesModel) {
        this.favorites = { ...favorites };
        this.favoritesDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected favoritess?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.favoritess.set(this.favoritess().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    changeProductDialogvisibile(visible:boolean) {
        this.favoritesDialog = visible;
        if(!visible){
            this.editFavoritesData=null
        }
    }

    hideDialog() {
        this.favoritesDialog = false;
        this.submitted = false;
    }

    deleteProduct(favorites: FavoritesModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + favorites.patientUserId + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.favoritess.set(this.favoritess().filter((val) => val.id !== favorites.id));
                this.favorites = {  doctorUserId: null, patientUserId: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Favorites Deleted',
                    life: 3000
                });
            }
        });
    }
 }
