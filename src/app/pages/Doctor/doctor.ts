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
import { DoctorList } from './doctor_list';
import { DoctorAddUpdate } from './doctor_add_update';
import { DoctorService } from '../service/doctor.service';
import { DoctorModel } from './doctor_model';

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
    DoctorList,
    DoctorAddUpdate
],

    template: `<app-doctor-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
     <app-doctor-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [doctorDialog]= 'doctorDialog'
    (doctorSaved)="onDoctorSaved()" [editDoctorData] = 'editDoctorData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, DoctorService, ConfirmationService]
})
export class Doctor implements OnInit {
    doctorDialog: boolean = false;

    doctors = signal<DoctorModel[]>([]);

    doctor!: DoctorModel;

    selectedProducts!: DoctorModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(DoctorList) doctorlist!: DoctorList;

    editDoctorData!:DoctorModel

    constructor(
        @Inject(DoctorService) private doctorService: DoctorService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    editEvent(doctor: DoctorModel){
        this.editDoctorData=doctor
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
        this.doctor = { id: null, name: null, surname: null}; // height özelliği eklendi
        this.submitted = false;
        this.doctorDialog = true;
    }

    onDoctorSaved() {
        this.doctorlist.loadDemoData();
        this.doctorDialog = false; 
    }
      

    editDoctor(doctor: DoctorModel) {
        this.doctor = { ...doctor };
        this.doctorDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected doctors?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.doctors.set(this.doctors().filter((val) => !this.selectedProducts?.includes(val)));
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
        this.doctorDialog = visible;
        if(!visible){
            this.editDoctorData=null
        }
    }

    hideDialog() {
        this.doctorDialog = false;
        this.submitted = false;
    }

    deleteProduct(doctor: DoctorModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + doctor.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.doctors.set(this.doctors().filter((val) => val.id !== doctor.id));
                this.doctor = { id: null, name: null, surname: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Doctor Deleted',
                    life: 3000
                });
            }
        });
    }
 }
