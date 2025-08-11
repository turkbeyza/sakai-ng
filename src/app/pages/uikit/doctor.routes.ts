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
import { Doctor } from '../Doctor/doctor';

export default [
    { path: 'doctor', data: { breadcrumb: 'Doctor' }, component: Doctor },

] as Routes;
