import { Routes } from '@angular/router';
import { ButtonDemo } from './buttondemo';
import { ChartDemo } from './chartdemo';
import { FileDemo } from './filedemo';
import { FormLayoutDemo } from './formlayoutdemo';
import { InputDemo } from './inputdemo';
import { MessagesDemo } from './messagesdemo';
import { MiscDemo } from './miscdemo';
import { PanelsDemo } from './panelsdemo';
import { TimelineDemo } from './timelinedemo';

import { TreeDemo } from './treedemo';
import { MenuDemo } from './menudemo';
import { Hospital } from '../Hospital/hospital';
import { Doctor } from '../Doctor/doctor';
import { Patient } from '../Patient/patient';
import { Appointments } from '../Appointments/appointments';
import { Favorites } from '../Favorites/favorites';
import { Results } from '../Results/results';


export default [
    { path: 'button', data: { breadcrumb: 'Button' }, component: ButtonDemo },
    { path: 'hospital', data: { breadcrumb: 'hospital' }, component: Hospital },
    { path: 'patient', data: { breadcrumb: 'patient' }, component: Patient },
    { path: 'doctor', data: { breadcrumb: 'doctor' }, component: Doctor },
    { path: 'appointments', data: { breadcrumb: 'appointments' }, component: Appointments },
    { path: 'favorites', data: { breadcrumb: 'favorites' }, component: Favorites},
    { path: 'results', data: { breadcrumb: 'results' }, component: Results },
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'file', data: { breadcrumb: 'File' }, component: FileDemo },
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    { path: 'tree', data: { breadcrumb: 'Tree' }, component: TreeDemo },
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
