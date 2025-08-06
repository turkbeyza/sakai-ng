import { Component, OnInit, Output,  EventEmitter, signal, ViewChild, Inject } from '@angular/core';
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
import { HospitalModel, HospitalService } from '../service/hospital.service';



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
    selector: 'app-hospital-list',
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

            
            <ng-template pTemplate="body" let-hospital>
    <tr>
      <td>{{ hospital.name }}</td>
      <td>{{ hospital.address }}</td>
      <td>{{ hospital.phone }}</td>
      <td>
      <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2"
  (click)="editHospital(hospital)">
</button>

      </td>
    </tr>
  </ng-template>




            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt

            [value]="hospitals"

            
            [value]="hospitals"

            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name']"
            [tableStyle]="{ 'min-width': '75rem' }"

            [(selection)]="selectedProduct"

            [(selection)]="selectedProducts"

            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} hospitals"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"

            selectionMode ='single'


        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Products</h5>
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

                    

                    <th pSortableColumn="name" style="min-width:16rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>

                <th pSortableColumn="phone" style="min-width: 12rem">
            Phone Number
            <p-sortIcon field="phone" />
        </th>
    
    <th pSortableColumn="address" style="width: 100%">
            Address
            <p-sortIcon field="address" />
        </th>
        <th style="min-width: 12rem " > Edit </th>

        </tr>

            </ng-template>
            <ng-template #body let-hospital>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="hospital" />
                    </td>

                    <td style="min-width: 16rem">{{ hospital.name }}</td>
                    <td>{{ hospital.phone }}</td>
                    <td>{{ hospital.address }}</td>
                    <td>

                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editHospital(hospital)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
<p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, HospitalService, ConfirmationService]
})
export class HospitalList implements OnInit {


hospital: any;


@Output() changeProductDialogvisibile = new EventEmitter<boolean>();
@Output() editEvent = new EventEmitter<HospitalModel>();



    hospitals: any[] = [];

    

    selectedProduct!: HospitalModel[];

    selectedProducts!: HospitalModel[] | null;

    submitted: boolean = false;

    

    @ViewChild('dt') dt!: Table;


    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(

        @Inject(HospitalService) private hospitalService: HospitalService,


        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }


    loadHospitals(): void {
        this.hospitalService.getHospitals().subscribe(data => {
          this.hospital = data;
        });
      }

    loadDemoData() {

       
        this.hospitalService.getHospitals().subscribe({
            next: (data: any) => {
                this.hospitals = data;
                console.log(data);
            },
            error: (err: any) => console.log(err)
        });
          


        this.cols = [
        //      { field: 'code', header: 'Code', customExportHeader: 'Hospital Code' },
        //      { field: 'name', header: 'Name' },
        // //   //  { field: 'image', header: 'Image' },
        //      { field: 'price', header: 'Price' },
        //     { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.changeProductDialogvisibile.emit(true);
        this.loadDemoData();
        
    }


    editHospital(hospital: any) {
        
        this.editEvent.emit(hospital);  // Edit modunda hospital gönderiyoruz
        this.changeProductDialogvisibile.emit(true); // Dialogu aç
      }
      


    deleteSelectedProducts() {


        
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected hospitals?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',

            accept: ( ) => { 
                
                this.hospitalService.deleteHospital(this.selectedProduct[0].id).subscribe({
                    next: (data: any) => {
                        // this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Products Deleted',
                            life: 3000
                        });
                          this.loadDemoData();
                          this.selectedProduct=[];
                    },
                    error: (err: any) => console.log(err)
                });
                
            }
        });
    }


    hideDialog() {
        this.submitted = false;
    }

    @Output() deleteProductEvent = new EventEmitter<HospitalModel>();






    deleteProduct(hospital: HospitalModel) {
    }

    findIndexById(id: string): number {
         let index = -1;
         return index;

}
    

    

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

}
