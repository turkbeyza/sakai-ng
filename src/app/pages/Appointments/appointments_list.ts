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
import { AppointmentsModel } from './appointments_model';
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
    selector: 'app-appointments-list',
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
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProduct || selectedProduct.length === 0" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="appointmentss"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['patientName', 'doctorName', 'hospitalName', 'appointmentDate']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProduct"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            selectionMode="single"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Appointments</h5>
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
                    <th pSortableColumn="hospitalName" style="width: 100%">
                        Hospital Name
                        <p-sortIcon field="hospitalName" />
                    </th>
                    <th pSortableColumn="appointmentDate" style="width: 100%">
                        Appointment Date
                        <p-sortIcon field="appointmentDate" />
                    </th>
                    <th style="min-width: 12rem">Edit</th>
                </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-appointment>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="appointment" />
                    </td>
                    <td style="min-width: 16rem">{{ getPatientName(appointment.patientUserId) }}</td>
                    <td>{{ getDoctorName(appointment.doctorUserId) }}</td>
                    <td>{{ getHospitalName(appointment.hospitalId) }}</td>
                    <td>{{ appointment.appointmentDate | date: 'short' }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true"
                            (click)="editAppointments(appointment)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-confirmdialog [style]="{ width: '450px' }" />

        <p-dialog 
            header="Appointment Details" 
            [(visible)]="dialogVisible" 
            [modal]="true" 
            [style]="{width: '600px', height: 'auto'}"
            [contentStyle]="{'overflow-y': 'visible', 'max-height': '80vh'}"
            [appendTo]="'body'"
            [closeOnEscape]="true">
            
            <div class="p-fluid" style="padding: 1rem 0;">
                <div class="field" style="margin-bottom: 1.5rem;">
                    <label for="patient" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Patient *</label>
                    <p-select 
                        id="patient"
                        [(ngModel)]="selectedAppointment.patientUserId" 
                        [options]="patients" 
                        optionLabel="name" 
                        optionValue="id" 
                        placeholder="Select Patient"
                        [filter]="true"
                        filterBy="name"
                        [showClear]="true"
                        [style]="{'width': '100%', 'min-height': '40px'}"
                        [panelStyle]="{'max-height': '200px', 'z-index': '9999'}">
                    </p-select>
                </div>

                <div class="field" style="margin-bottom: 1.5rem;">
                    <label for="doctor" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Doctor *</label>
                    <p-select 
                        id="doctor"
                        [(ngModel)]="selectedAppointment.doctorUserId" 
                        [options]="doctors" 
                        optionLabel="name" 
                        optionValue="id" 
                        placeholder="Select Doctor"
                        [filter]="true"
                        filterBy="name"
                        [showClear]="true"
                        [style]="{'width': '100%', 'min-height': '40px'}"
                        [panelStyle]="{'max-height': '200px', 'z-index': '9999'}">
                    </p-select>
                </div>

                <div class="field" style="margin-bottom: 1.5rem;">
                    <label for="hospital" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Hospital *</label>
                    <p-select 
                        id="hospital"
                        [(ngModel)]="selectedAppointment.hospitalId" 
                        [options]="hospitals" 
                        optionLabel="name" 
                        optionValue="id" 
                        placeholder="Select Hospital"
                        [filter]="true"
                        filterBy="name"
                        [showClear]="true"
                        [style]="{'width': '100%', 'min-height': '40px'}"
                        [panelStyle]="{'max-height': '200px', 'z-index': '9999'}">
                    </p-select>
                </div>

                <div class="field" style="margin-bottom: 1.5rem;">
                    <label for="appointmentDate" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Appointment Date & Time *</label>
                    <input 
                        id="appointmentDate"
                        type="datetime-local" 
                        pInputText 
                        [(ngModel)]="selectedAppointment.appointmentDate"
                        style="width: 100%; height: 40px; padding: 0.5rem;" />
                </div>
            </div>

            <ng-template #footer>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 1rem;">
                    <p-button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        [outlined]="true" 
                        severity="secondary"
                        (click)="hideDialog()" 
                        [style]="{'min-width': '100px'}" />
                    <p-button 
                        label="Save" 
                        icon="pi pi-check" 
                        severity="primary"
                        (click)="saveAppointment()" 
                        [style]="{'min-width': '100px'}" />
                </div>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, AppointmentsService, ConfirmationService]
})
export class AppointmentsList implements OnInit {

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() editEvent = new EventEmitter<AppointmentsModel>();
    @Output() deleteProductEvent = new EventEmitter<AppointmentsModel>();

    appointmentss: any[] = [];
    selectedProduct!: AppointmentsModel[];
    selectedProducts!: AppointmentsModel[] | null;
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;
    
    selectedAppointment: any = {};
    hospitals: any[] = [];
    doctors: any[] = [];
    patients: any[] = [];
    dialogVisible: boolean = false;

    constructor(
        @Inject(AppointmentsService) private appointmentsService: AppointmentsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadDemoData();
        this.loadDropdownData();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    loadAppointmentss(): void {
        this.appointmentsService.getAppointments().subscribe(data => {
            this.appointmentss = data;
        });
    }

    loadDemoData() {
        this.appointmentsService.getAppointments().subscribe({
            next: (data: any) => {
                this.appointmentss = data;
                console.log(data);
            },
            error: (err: any) => console.log(err)
        });
    }

    // Dropdown verilerini yüklemek için method
    loadDropdownData() {
        // Patients yükle
        this.appointmentsService.getPatients().subscribe({
            next: (data: any) => {
                this.patients = data;
            },
            error: (err: any) => console.log('Error loading patients:', err)
        });

        // Doctors yükle
        this.appointmentsService.getDoctors().subscribe({
            next: (data: any) => {
                this.doctors = data;
            },
            error: (err: any) => console.log('Error loading doctors:', err)
        });

        // Hospitals yükle
        this.appointmentsService.getHospitals().subscribe({
            next: (data: any) => {
                this.hospitals = data;
            },
            error: (err: any) => console.log('Error loading hospitals:', err)
        });
    }

    // Helper methodlar - ID'den isim almak için
    getPatientName(patientId: any): string {
        const patient = this.patients.find(p => p.id === patientId);
        return patient ? patient.name : 'Unknown Patient';
    }

    getDoctorName(doctorId: any): string {
        const doctor = this.doctors.find(d => d.id === doctorId);
        return doctor ? `${doctor.name} ${doctor.surname}` : 'Unknown Doctor';
    }

    getHospitalName(hospitalId: any): string {
        const hospital = this.hospitals.find(h => h.id === hospitalId);
        return hospital ? hospital.name : 'Unknown Hospital';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.selectedAppointment = {
            patientUserId: null,
            doctorUserId: null,
            hospitalId: null,
            appointmentDate: null
        };
        this.dialogVisible = true;
    }

    editAppointments(appointment: any) {
        this.selectedAppointment = { ...appointment };
        this.dialogVisible = true;
    }

    // saveAppointment() {
    //     if (this.selectedAppointment.id) {
    //         const localDate = new Date(); // Initialize localDate
    //         this.selectedAppointment.appointmentDate = localDate.toISOString();

    //         // Güncelleme
    //         this.appointmentsService.updateAppointments(this.selectedAppointment).subscribe(
    //             {
    //             next: (data: any) => {
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Appointment Updated',
    //                     life: 3000
    //                 });
    //                 this.loadDemoData();
    //                 this.hideDialog();
    //             },
    //             error: (err: any) => {
    //                 console.log(err);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'Failed to update appointment',
    //                     life: 3000
    //                 });
    //             }
    //         });
    //     } else {

    //         const localDate = new Date(this.selectedAppointment.appointmentDate);
    //         this.selectedAppointment.appointmentDate = new Date(
    //             localDate.getTime() + localDate.getTimezoneOffset() * 60000
    //         ).toISOString();
            
    //         // Yeni kayıt
    //         this.appointmentsService.createAppointment(this.selectedAppointment).subscribe({
    //             next: (data: any) => {
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Appointment Created',
    //                     life: 3000
    //                 });
    //                 this.loadDemoData();
    //                 this.hideDialog();
    //             },
    //             error: (err: any) => {
    //                 console.log(err);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'Failed to create appointment',
    //                     life: 3000
    //                 });
    //             }
    //         });
    //     }
    // }


    saveAppointment() {
        if (
          this.selectedAppointment.patientUserId &&
          this.selectedAppointment.doctorUserId &&
          this.selectedAppointment.hospitalId &&
          this.selectedAppointment.appointmentDate
        ) {
          // Convert datetime-local input (yyyy-MM-ddTHH:mm) to ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)
          const localDate = new Date(this.selectedAppointment.appointmentDate);
          const isoDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000).toISOString();
          this.selectedAppointment.appointmentDate = isoDate;
      
          if (this.selectedAppointment.id) {
            // Update existing appointment
            this.appointmentsService.updateAppointments(this.selectedAppointment).subscribe({
              next: (data: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Appointment Updated',
                  life: 3000
                });
                this.loadDemoData();
                this.hideDialog();
              },
              error: (err: any) => {
                console.log(err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update appointment',
                  life: 3000
                });
              }
            });
          } else {
            // Create new appointment
            this.appointmentsService.createAppointment(this.selectedAppointment).subscribe({
              next: (data: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Appointment Created',
                  life: 3000
                });
                this.loadDemoData();
                this.hideDialog();
              },
              error: (err: any) => {
                console.log(err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create appointment',
                  life: 3000
                });
              }
            });
          }
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'Please complete all required fields.',
            life: 3000
          });
        }
      }
      

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected appointment?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.appointmentsService.deleteAppointments(this.selectedProduct[0].id).subscribe({
                    next: (data: any) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Appointment Deleted',
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

    hideDialog() {
        this.dialogVisible = false;
        this.submitted = false;
    }

    deleteProduct(appointments: AppointmentsModel) {
        // Bu method gerekirse implement edilebilir
    }
}