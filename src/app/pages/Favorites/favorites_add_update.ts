import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Message } from "primeng/message";
import { SelectModule } from 'primeng/select';
import { FavoritesModel } from './favorites_model';
import { FavoritesService } from '../service/favorites_service';

@Component({
    selector: 'app-favorites-add-update',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        Message,
        SelectModule
    ],
    template: `
<p-dialog [(visible)]="favoritesDialog" [style]="{ width: '450px' }" header="Add Favorites" [modal]="true" (onHide)="hideDialog()">
    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full">
        
        <div class="flex flex-col gap-1">
            <p-select 
                formControlName="patientUserId" 
                [options]="patients" 
                optionLabel="fullName" 
                optionValue="id" 
                placeholder="Select Patient"
                appendTo="body">
            </p-select>
            <p-message *ngIf="isInvalid('patientUserId')" severity="error" size="small">Patient is required.</p-message>
        </div>

        <div class="flex flex-col gap-1">
            <p-select 
                formControlName="doctorUserId" 
                [options]="doctors" 
                optionLabel="fullName" 
                optionValue="id" 
                placeholder="Select Doctor"
                appendTo="body">
            </p-select>
            <p-message *ngIf="isInvalid('doctorUserId')" severity="error" size="small">Doctor is required.</p-message>
        </div>

        <button pButton type="submit" icon="pi pi-check" label="Save"></button>
    </form>
</p-dialog>
    `,
    providers: [MessageService, FavoritesService, ConfirmationService],
    styles: [`
        /* Açılır liste yüksekliğini artır */
        ::ng-deep .p-select-items-wrapper {
            max-height: 400px !important; /* Daha uzun görünmesi için */
        }
    `]
})
export class FavoritesAddUpdate implements OnInit, OnChanges {
    @Input() favoritesDialog: boolean = false;
    @Input() editFavoritesData!: FavoritesModel;
    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() favoritesSaved = new EventEmitter<void>();

    favorites!: FavoritesModel;
    exampleForm: any;

    patients: any[] = [];
    doctors: any[] = [];

    constructor(
        private favoritesService: FavoritesService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.exampleForm = this.fb.group({
            patientUserId: ['', Validators.required],
            doctorUserId: ['', Validators.required]
        });

        this.loadDropdownData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['favoritesDialog'] && changes['favoritesDialog'].currentValue) {
            if (this.editFavoritesData) {
                this.exampleForm.patchValue({
                    patientUserId: this.editFavoritesData.patientUserId,
                    doctorUserId: this.editFavoritesData.doctorUserId
                });
                this.favorites = { ...this.editFavoritesData };
            } else {
                this.favorites = { id: '', patientUserId: '', doctorUserId: '' };
                this.exampleForm.reset();
            }
        }
    }

    loadDropdownData() {
        this.favoritesService.getPatients().subscribe((data: any) => {
            this.patients = data.map((p: any) => ({
                id: p.id,
                fullName: p.name + ' ' + p.surname
            }));
        });

        this.favoritesService.getDoctors().subscribe((data: any) => {
            this.doctors = data.map((d: any) => ({
                id: d.id,
                fullName: d.name + ' ' + d.surname
            }));
        });
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit() {
        if (this.exampleForm.valid) {
            const formData = this.exampleForm.value;
            const favorites: FavoritesModel = {
                ...this.favorites,
                patientUserId: formData.patientUserId,
                doctorUserId: formData.doctorUserId
            };

            const request = this.favorites?.id
                ? this.favoritesService.updateFavorites(favorites)
                : this.favoritesService.addFavorites(favorites);

            request.subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.favorites?.id ? 'Updated' : 'Added',
                        detail: 'Favorites saved successfully'
                    });
                    this.favoritesSaved.emit();
                    this.closeDialog();
                    this.exampleForm.reset();
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to save favorites'
                    });
                }
            });
        } else {
            this.exampleForm.markAllAsTouched();
        }
    }

    closeDialog() {
        this.changeProductDialogvisibile.emit(false);
    }

    hideDialog() {
        this.changeProductDialogvisibile.emit(false);
    }
}
