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
import { HospitalList } from './hospital_list';
import { HospitalAddUpdate } from './hospital_add_update';
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
    HospitalList,
    HospitalAddUpdate
],

    template: `<app-hospital-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
    <app-hospital-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [hospitalDialog]= 'hospitalDialog'
    (hospitalSaved)="onHospitalSaved()" [editHospitalData] = 'editHospitalData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, HospitalService, ConfirmationService]
})
export class Hospital implements OnInit {
    hospitalDialog: boolean = false;

    hospitals = signal<HospitalModel[]>([]);

    hospital!: HospitalModel;

    selectedProducts!: HospitalModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(HospitalList) hospitallist!: HospitalList;

    editHospitalData!:HospitalModel

    constructor(
        @Inject(HospitalService) private hospitalService: HospitalService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    editEvent(hospital: HospitalModel){
        this.editHospitalData=hospital
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
        this.hospital = { address: null, phone: null };
        this.submitted = false;
        this.hospitalDialog = true;
    }


    onHospitalSaved() {
        this.hospitallist.loadDemoData();
        this.hospitalDialog = false; 
      }
      

    editHospital(hospital: HospitalModel) {
        this.hospital = { ...hospital };
        this.hospitalDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected hospitals?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.hospitals.set(this.hospitals().filter((val) => !this.selectedProducts?.includes(val)));
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
        this.hospitalDialog = visible;
        if(!visible){
            this.editHospitalData=null
        }
    }

    hideDialog() {
        this.hospitalDialog = false;
        this.submitted = false;
    }

    deleteProduct(hospital: HospitalModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + hospital.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.hospitals.set(this.hospitals().filter((val) => val.id !== hospital.id));
                this.hospital = { address: null, phone: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Hospital Deleted',
                    life: 3000
                });
            }
        });
    }
 }
