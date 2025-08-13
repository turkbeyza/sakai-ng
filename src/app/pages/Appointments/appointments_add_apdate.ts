import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Message } from "primeng/message";
import { OnChanges, SimpleChanges } from '@angular/core';
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
    selector: 'app-appointments-add-update',
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
    ReactiveFormsModule,
    Message,
    
],
    template: `


<p-dialog [(visible)]="appointmentsDialog" [style]="{ width: '450px' }" header="Add Appointments" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="patientUserId" placeholder="patientUserId" formControlName="patientUserId" [invalid]="isInvalid('patientUserId')" />
        @if (isInvalid('patientUserId')) {
            <p-message severity="error" size="small" variant="simple">lName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="doctorUserId" placeholder="doctorUserId" formControlName="doctorUserId" [invalid]="isInvalid('doctorUserId')" />
        @if (isInvalid('doctorUserId')) {
            @if (exampleForm.get('doctorUserId')?.errors?.['doctorUserId']) {
                <p-message severity="error" size="small" variant="simple">address is required.</p-message>
            }
            @if (exampleForm.get('doctorUserId')?.errors?.['doctorUserId']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid address.</p-message>
            }
        }

        <div class="flex flex-col gap-1">
  <input pInputText type="text" id="HospitalId" placeholder="HospitalId" formControlName="hospitalId" [invalid]="isInvalid('HospitalId')" />
  @if (isInvalid('HospitalId')) {
    @if (exampleForm.get('HospitalId')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('HospitalId')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid phone number.</p-message>
    }
  }

  <div class="flex flex-col gap-1">
  <input pInputText type="text" id="AppointmentDate" placeholder="AppointmentDate" formControlName="appointmentDate" [invalid]="isInvalid('AppointmentDate')" />
  @if (isInvalid('AppointmentDate')) {
    @if (exampleForm.get('AppointmentDate')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('AppointmentDate')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid phone number.</p-message>
    }
  }
</div>

    </div>

        </div>

  <button pButton type="save" icon="pi pi-check" label="Save"></button>
</form> 

           
            <ng-template #footer>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, AppointmentsService, ConfirmationService]


    
})
export class AppointmentsAddUpdate implements OnInit, OnChanges {
    
    @Input() appointmentsDialog: boolean = false;
    @Input() editAppointmentsData!: AppointmentsModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() appointmentsSaved = new EventEmitter<void>();


    appointments!: AppointmentsModel;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    exampleForm: any;
    dialog: boolean | undefined;
    dialogVisible: boolean;
    selectedAppointment: any;


    constructor(
        private appointmentsService: AppointmentsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    
        ngOnInit() {
                this.exampleForm = this.fb.group({
                    patientUserId: ['', Validators.required],
                    doctorUserId: ['', [Validators.required, Validators.required]],
                    hospitalId: ['', [Validators.required]],
                    appointmentDate: ['', [Validators.required]]
                });
            }

//           ngOnChanges(changes: SimpleChanges): void {
//             if (changes['appointmentsDialog'] && changes['appointmentsDialog'].currentValue) {
//                 debugger
//    if (this.editAppointmentsData) {
//     this.exampleForm.patchValue({
//         patientUserId: this.editAppointmentsData.patientUserId,
//         doctorUserId: this.editAppointmentsData.doctorUserId,
//         hospitalId: this.editAppointmentsData.hospitalId,
//         appointmentDate: this.editAppointmentsData.appointmentDate

//       });
//       this.appointments = { ...this.editAppointmentsData }; // update mode
// } else {
//         this.appointments = {
//             patientUserId: '',
//             doctorUserId: '',
//             hospitalId: '',
//             appointmentDate: new Date(), // add mode
//             id: null // add mode
//         };
//         this.exampleForm.reset(); // add mode

//                         } 
//           }
//         }
          

ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentsDialog'] && changes['appointmentsDialog'].currentValue) {
      if (this.editAppointmentsData) {
        // Format the appointmentDate for datetime-local input (yyyy-MM-ddTHH:mm)
        const date = new Date(this.editAppointmentsData.appointmentDate);
        const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16); // Slice to get yyyy-MM-ddTHH:mm
  
        this.exampleForm.patchValue({
          patientUserId: this.editAppointmentsData.patientUserId,
          doctorUserId: this.editAppointmentsData.doctorUserId,
          hospitalId: this.editAppointmentsData.hospitalId,
          appointmentDate: localISO
        });
        this.appointments = { ...this.editAppointmentsData, appointmentDate: localISO };
      } else {
        // For add mode, initialize with current date in correct format
        const currentDate = new Date();
        const localISO = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        this.appointments = {
          patientUserId: '',
          doctorUserId: '',
          hospitalId: '',
          appointmentDate: localISO,
          id: null
        };
        this.exampleForm.reset();
        this.exampleForm.patchValue({ appointmentDate: localISO });
      }
    }
  }
             

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
      }
      

// onSubmit() {
        
//             if (this.exampleForm.valid) {
                
//                 const formData = this.exampleForm.value;
        
//                 const appointments: AppointmentsModel = {
//                     ...this.appointments,
//                     patientUserId: formData.patientUserId,
//                     doctorUserId: formData.doctorUserId,
//                     hospitalId: formData.hospitalId,
//                     appointmentDate: formData.appointmentDate
//                 };
        
//                 if (this.appointments?.id) {
//                     this.appointmentsService.updateAppointments(appointments).subscribe({
//                         next: () => {
//                             this.messageService.add({
//                                 severity: 'success',
//                                 summary: 'Updated',
//                                 detail: 'Appointments updated successfully'
//                             });
//                             this.appointmentsSaved.emit();
//                             this.closeDialog();
//                         },
//                         error: () => {
//                             this.messageService.add({
//                                 severity: 'error',
//                                 summary: 'Error',
//                                 detail: 'Failed to update appointments'
//                             });
//                         }
//                     });
//                 } else {
                    
//                     this.appointmentsService.addAppointments(appointments).subscribe({
//                         next: () => {
                            
//                             this.messageService.add({
//                                 severity: 'success',
//                                 summary: 'Added',
//                                 detail: 'Appointments added successfully'
//                             });
//                             this.appointmentsSaved.emit(); 
//                             this.closeDialog();
//                             this.exampleForm.reset(); 
//                         },
//                         error: () => {
//                             this.messageService.add({
//                                 severity: 'error',
//                                 summary: 'Error',
//                                 detail: 'Failed to add appointments'
//                             });
//                         }
//                     });
//                 }
//             } else {
//                 this.exampleForm.markAllAsTouched();
//                 this.messageService.add({
//                     severity: 'warn',
//                     summary: 'Validation Error',
//                     detail: 'Please complete the form before submitting.'
//                 });
//             }
//         }
onSubmit() {
    if (this.exampleForm.valid) {
      const formData = this.exampleForm.value;
  
      // Convert datetime-local input (yyyy-MM-ddTHH:mm) to ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)
      const localDate = new Date(formData.appointmentDate);
      const isoDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000).toISOString();
  
      const appointments: AppointmentsModel = {
        ...this.appointments,
        patientUserId: formData.patientUserId,
        doctorUserId: formData.doctorUserId,
        hospitalId: formData.hospitalId,
        appointmentDate: isoDate
      };
  
      if (this.appointments?.id) {
        this.appointmentsService.updateAppointments(appointments).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Appointments updated successfully'
            });
            this.appointmentsSaved.emit();
            this.closeDialog();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update appointments'
            });
          }
        });
      } else {
        this.appointmentsService.addAppointments(appointments).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: 'Appointments added successfully'
            });
            this.appointmentsSaved.emit();
            this.closeDialog();
            this.exampleForm.reset();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add appointments'
            });
          }
        });
      }
    } else {
      this.exampleForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please complete the form before submitting.'
      });
    }
  }

    closeDialog() {
        
        this.changeProductDialogvisibile.emit(false)
    }
    
    openNew() {
        this.appointments = { patientUserId: '', doctorUserId: '', hospitalId: '', appointmentDate: new Date(), id: null };
        this.submitted = false;
        this.appointmentsDialog = true;
    }

// editAppointments(appointments: AppointmentsModel) {
//   this.appointments = { ...appointments };  
//   this.appointmentsDialog = true;

//   this.exampleForm.patchValue({
//     patientUserId: appointments.patientUserId,
//     doctorUserId: appointments.doctorUserId,
//     hospitalId: appointments.hospitalId,
//     appointmentDate: appointments.appointmentDate
//   });
// }

editAppointments(appointment: any) {
    const date = new Date(appointment.appointmentDate);
    // datetime-local input için yyyy-MM-ddTHH:mm formatı
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0,16);

    this.selectedAppointment = {
        ...appointment,
        appointmentDate: localISO
    };
    this.dialogVisible = true;
}


    hideDialog() {
        this.changeProductDialogvisibile.emit(false)

    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    saveProduct() {
        this.submitted = true;
        if (this.appointments.id?.trim()) {
            if (this.appointments.id) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Appointments Updated',
                    life: 3000
                });
            } else {
                this.appointments.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Appointments Created',
                    life: 3000
                });
            }

            this.appointmentsDialog = false;
            this.appointments = { patientUserId: '', doctorUserId: '', hospitalId: '', appointmentDate: new Date(), id: null };
        }
    }
}
