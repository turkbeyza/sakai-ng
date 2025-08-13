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
import { AppointmentsList } from './appointments_list';
import { AppointmentsModel } from './appointments_model';
import { AppointmentsAddUpdate } from './appointments_add_apdate';
import { AppointmentsService } from '../service/appointments.service';



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
    AppointmentsList,
    AppointmentsAddUpdate
],

    template: `<app-appointments-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)' (editEvent)='editEvent($event)' />

    
    <app-appointments-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [appointmentsDialog]= 'appointmentsDialog'
    (appointmentsSaved)="onAppointmentsSaved()" [editAppointmentsData] = 'editAppointmentsData'  />


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, AppointmentsService, ConfirmationService]
})
export class Appointments implements OnInit {
    appointmentsDialog: boolean = false;

    appointmentss = signal<AppointmentsModel[]>([]);

    appointments!: AppointmentsModel;

    selectedProducts!: AppointmentsModel[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(AppointmentsList) appointmentslist!: AppointmentsList;

    editAppointmentsData!:AppointmentsModel
    patients: any;
    doctors: any;
    hospitals: any;
    selectedAppointment: {};
    dialogVisible: boolean;

    constructor(
        @Inject(AppointmentsService) private appointmentsService: AppointmentsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadDemoData();
        this.loadDropdownData();
      }
      
      loadDropdownData() {
        this.appointmentsService.getPatients().subscribe(res => this.patients = res);
        this.appointmentsService.getDoctors().subscribe(res => this.doctors = res);
        this.appointmentsService.getHospitals().subscribe(res => this.hospitals = res);
      }
      
      openNew() {
        this.selectedAppointment = {};
        this.dialogVisible = true;
      }
      
      editAppointments(appointments: any) { 
        this.selectedAppointment = { ...appointments };
        this.dialogVisible = true;
      }
      
        saveAppointment() {
            if ((this.selectedAppointment as AppointmentsModel).patientUserId) {
                this.appointmentsService.updateAppointments(this.selectedAppointment).subscribe(() => this.loadDemoData());
            } else {
                this.appointmentsService.addAppointments(this.selectedAppointment).subscribe(() => this.loadDemoData());
            }
            this.dialogVisible = false;
        }


    editEvent(appointments: AppointmentsModel){
            this.editAppointmentsData=appointments
    }
    exportCSV() {
        this.dt.exportCSV();
    }

    // ngOnInit() {
    //     this.loadDemoData();
    // }

    loadDemoData() {
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // openNew() {
    //     this.appointments = { id: null, patientUserId: null, doctorUserId: null, hospitalId: null, appointmentDate: null };
    //     this.submitted = false;
    //     this.appointmentsDialog = true;
    // }

    onAppointmentsSaved() {
        this.appointmentslist.loadDemoData();
        this.appointmentsDialog = false; 
    }
      

    // editAppointments(appointments: AppointmentsModel) {
    //     this.appointments = { ...appointments };
    //     this.appointmentsDialog = true;
    // }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected appointmentss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.appointmentss.set(this.appointmentss().filter((val) => !this.selectedProducts?.includes(val)));
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
        this.appointmentsDialog = visible;
        if(!visible){
            this.editAppointmentsData=null
        }
    }

    hideDialog() {
        this.appointmentsDialog = false;
        this.submitted = false;
    }

    deleteProduct(appointments: AppointmentsModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + appointments.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.appointmentss.set(this.appointmentss().filter((val) => val.id !== appointments.id));
                this.appointments = { id: null, patientUserId: null, doctorUserId: null, hospitalId: null, appointmentDate: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Appointments Deleted',
                    life: 3000
                });
            }
        });
    }
 }
