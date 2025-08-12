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
import { PatientList } from './patient_list';
import { PatientAddUpdate } from './patient_add_update';
import { PatientModel } from './patient_model';
import { PatientService } from '../service/patient.service';

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
    PatientList,
    PatientAddUpdate
],

    template: `<app-patient-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
     <app-patient-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [patientDialog]= 'patientDialog'
    (patientSaved)="onPatientSaved()" [editPatientData] = 'editPatientData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, PatientService, ConfirmationService]
})
export class Patient implements OnInit {
    patientDialog: boolean = false;

    patients = signal<PatientModel[]>([]);

    patient!: PatientModel;

    selectedProducts!: PatientModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(PatientList) patientlist!: PatientList;

    editPatientData!:PatientModel

    constructor(
        @Inject(PatientService) private patientService: PatientService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    editEvent(patient: PatientModel){
        this.editPatientData=patient
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
        this.patient = { id: null, name: null, surname: null}; 
        this.submitted = false;
        this.patientDialog = true;
    }

    onPatientSaved() {
        this.patientlist.loadDemoData();
        this.patientDialog = false; 
    }
      

    editPatient(patient: PatientModel) {
        this.patient = { ...patient };
        this.patientDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected patients?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.patients.set(this.patients().filter((val) => !this.selectedProducts?.includes(val)));
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
        this.patientDialog = visible;
        if(!visible){
            this.editPatientData=null
        }
    }

    hideDialog() {
        this.patientDialog = false;
        this.submitted = false;
    }

    deleteProduct(patient: PatientModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + patient.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.patients.set(this.patients().filter((val) => val.id !== patient.id));
                this.patient = { id: null, name: null, surname: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Patient Deleted',
                    life: 3000
                });
            }
        });
    }
 }
