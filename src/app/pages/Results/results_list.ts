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
import { ResultsModel } from './results_model';
import { ResultsService } from '../service/results.service';



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
    selector: 'app-results-list',
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

            
            <ng-template pTemplate="body" let-results>
    <tr>
      <td>{{ results.appointmentId }}</td>
      <td>{{ results.fileName }}</td>
      <td>{{ results.FilePath }}</td>
      <td>{{ results.createdAt }}</td>
      <td>
      <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2"
  (click)="editResults(results)">
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

            [value]="resultss"

            
            [value]="resultss"

            [rows]="10"
            
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name']"
            [tableStyle]="{ 'min-width': '75rem' }"

            [(selection)]="selectedProduct"

            [(selection)]="selectedProducts"

            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} resultss"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"

            selectionMode ='single'


        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Resultss</h5>
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

                    

                    <th pSortableColumn="appointmentId" style="min-width:16rem">
                        AppointmentId
                        <p-sortIcon field="appointmentId" />
                    </th>

                <th pSortableColumn="FileName" style="min-width: 12rem">
            File Name
            <p-sortIcon field="fileName" />
        </th>
    
    <th pSortableColumn="filePath" style="width: 100%">
            File Path
            <p-sortIcon field="filepath" />
        </th>

         <th pSortableColumn="createdAt" style="width: 100%">
            Created At
            <p-sortIcon field="createdAt" />
        </th> 


        <th style="min-width: 12rem " > Edit </th>

        </tr>

            </ng-template>
            <ng-template #body let-results>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="results" />
                    </td>

                    <td style="min-width: 16rem">{{ results.appointmentId }}</td>
                    <td>{{ results.fileName }}</td>
                    <td>{{ results.filePath }}</td>
                    <td>{{ results.createdAt }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editResults(results)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
<p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ResultsService, ConfirmationService]
})
export class ResultsList implements OnInit {


results: any;


@Output() changeProductDialogvisibile = new EventEmitter<boolean>();
@Output() editEvent = new EventEmitter<ResultsModel>();



    resultss: any[] = [];

    selectedProduct!: ResultsModel[];

    selectedProducts!: ResultsModel[] | null;

    submitted: boolean = false;

    

    @ViewChild('dt') dt!: Table;


    constructor(

        @Inject(ResultsService) private resultsService: ResultsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadResultss(): void {
        this.resultsService.getResultss().subscribe(data => {
          this.results = data;
        });
      }

    loadDemoData() {
        this.resultsService.getResultss().subscribe({
            next: (data: any) => {
                this.resultss = data;
                console.log(data);
            },
            error: (err: any) => console.log(err)
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.changeProductDialogvisibile.emit(true);
        this.loadDemoData();  
    }


    editResults(results: any) { 
        this.editEvent.emit(results);  
        this.changeProductDialogvisibile.emit(true); 
      }
      


    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected resultss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',

            accept: ( ) => { 
                
                this.resultsService.deleteResults(this.selectedProduct[0].id).subscribe({
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

    @Output() deleteProductEvent = new EventEmitter<ResultsModel>();


    deleteProduct(results: ResultsModel) {
    }

}
