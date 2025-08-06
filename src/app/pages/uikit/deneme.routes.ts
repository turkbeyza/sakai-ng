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
import { Hospital } from '../deneme/hospital';

export default [
    { path: 'hospital', data: { breadcrumb: 'Hospital' }, component: Hospital },

] as Routes;
