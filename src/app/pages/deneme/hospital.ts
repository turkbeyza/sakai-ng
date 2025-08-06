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

    <!-- (editEvent)="editHospital($event)" -->
    
    <app-hospital-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [hospitalDialog]= 'hospitalDialog'
    (hospitalSaved)="onHospitalSaved()" [editHospitalData] = 'editHospitalData'  />

    <!-- [editHospitalData]="hospital" -->

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

    exportColumns!: ExportColumn[];

    cols!: Column[];

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
        // this.hospitalService.getProducts().then((data) => {
        //     this.hospitals.set(data);
        // });

    

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Hospital Code' },
            { field: 'name', header: 'Name' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.hospital = { address: null, phone: null }; // 'address' ve 'phone' özellikleri eklendi
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

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.hospitals().length; i++) {
            if (this.hospitals()[i].id === id) {
                index = i;
                break;
            }
        }

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

    saveProduct() {
        this.submitted = true;
        let _products = this.hospitals();
        if (this.hospital.name?.trim()) {
            if (this.hospital.id) {
                _products[this.findIndexById(this.hospital.id)] = this.hospital;
                this.hospitals.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Hospital Updated',
                    life: 3000
                });
            } else {
                this.hospital.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Hospital Created',
                    life: 3000
                });
                this.hospitals.set([..._products, this.hospital]);
            }

            this.hospitalDialog = false;
            this.hospital = { address: null, phone: null }; // Initialize with required properties
        }
    }
}
