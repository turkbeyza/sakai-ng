import { Component, OnInit, Output, EventEmitter, signal, ViewChild, Inject } from '@angular/core';
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
import { FavoritesModel } from './favorites_model';
import { FavoritesService } from '../service/favorites_service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-favorites-list',
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
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProduct" />
            </ng-template>
            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="favoritess"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['patientName', 'doctorName']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProduct"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} favoritess"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            selectionMode='single'
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Favorites</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="patientName" style="min-width:16rem">
                        Patient Name
                        <p-sortIcon field="patientName" />
                    </th>
                    <th pSortableColumn="doctorName" style="min-width: 12rem">
                        Doctor Name
                        <p-sortIcon field="doctorName" />
                    </th>
                    <th style="min-width: 12rem">Edit</th>
                </tr>
            </ng-template>
            <ng-template #body let-favorites>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="favorites" />
                    </td>
                    <td>{{ favorites.patientName }}</td>
                    <td>{{ favorites.doctorName }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editFavorites(favorites)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, FavoritesService, ConfirmationService]
})
export class FavoritesList implements OnInit {
    favorites: any;
    favoritess: any[] = [];
    selectedProduct!: FavoritesModel[];
    submitted: boolean = false;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() editEvent = new EventEmitter<FavoritesModel>();

    @ViewChild('dt') dt!: Table;

    constructor(
        @Inject(FavoritesService) private favoritesService: FavoritesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.favoritesService.getFavorites().subscribe({
            next: (data: any) => {
                // ID'leri isim-soyisim ile eşleştiriyoruz
                this.favoritess = data.map((fav: any) => ({
                    ...fav,
                    patientName: fav.patientUser.name + ' ' + fav.patientUser.surname,
                    doctorName: fav.doctorUser.name + ' ' + fav.doctorUser.surname
                }));
            },
            error: (err: any) => console.log(err)
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.changeProductDialogvisibile.emit(true);
    }

    editFavorites(favorites: any) {
        this.editEvent.emit(favorites);
        this.changeProductDialogvisibile.emit(true);
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected favorites?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.favoritesService.deleteFavorites(this.selectedProduct[0].id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Favorites Deleted',
                            life: 3000
                        });
                        this.loadDemoData();
                        this.selectedProduct = [];
                    },
                    error: (err: any) => console.log(err)
                });
            }
        });
    }
}
