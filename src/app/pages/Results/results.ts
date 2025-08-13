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
import { ResultsList } from './results_list';
import { ResultsAddUpdate } from './results_add_update';
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
    ResultsList,
    ResultsAddUpdate
],

    template: `<app-results-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
    <app-results-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [resultsDialog]= 'resultsDialog'
    (resultsSaved)="onResultsSaved()" [editResultsData] = 'editResultsData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ResultsService, ConfirmationService]
})
export class Results implements OnInit {
    resultsDialog: boolean = false;

    resultss = signal<ResultsModel[]>([]);

    results!: ResultsModel;

    selectedProducts!: ResultsModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(ResultsList) resultslist!: ResultsList;

    editResultsData!:ResultsModel

    constructor(
        @Inject(ResultsService) private resultsService: ResultsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    editEvent(results: ResultsModel){
        this.editResultsData=results
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
        this.results = { id: '',
        appointmentId: '',
        fileName: '',
        filePath: '',
        createdAt: new Date() };
        this.submitted = false;
        this.resultsDialog = true;
    }


    onResultsSaved() {
        this.resultslist.loadDemoData();
        this.resultsDialog = false; 
      }
      

    editResults(results: ResultsModel) {
        this.results = { ...results };
        this.resultsDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected resultss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.resultss.set(this.resultss().filter((val) => !this.selectedProducts?.includes(val)));
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
        this.resultsDialog = visible;
        if(!visible){
            this.editResultsData=null
        }
    }

    hideDialog() {
        this.resultsDialog = false;
        this.submitted = false;
    }

    deleteProduct(results: ResultsModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + results.appointmentId + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.resultss.set(this.resultss().filter((val) => val.id !== results.id));
                this.results = {id: '',
                appointmentId: '',
                fileName: '',
                filePath: '',
                createdAt: new Date() }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Results Deleted',
                    life: 3000
                });
            }
        });
    }
 }
