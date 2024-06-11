import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';

// static loading icons
import {
  AlertFill,
  CalendarOutline,
  AlertOutline,
  FilterOutline,
  PlusOutline,
  MobileOutline,
  MailOutline,
  SearchOutline,
  QuestionCircleFill,
  HomeOutline,
  PhoneOutline,
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
  PlusOutline,
  AlertFill,
  CalendarOutline,
  AlertOutline,
  PlusOutline,
  FilterOutline,
  MobileOutline,
  MailOutline,
  SearchOutline,
  MailOutline,
  MobileOutline,
  QuestionCircleFill,
  HomeOutline,
  PhoneOutline,
];

@NgModule({
  imports: [
    CommonModule,
    NzIconModule.forRoot(icons)
  ]
})
export class IconModule { }
