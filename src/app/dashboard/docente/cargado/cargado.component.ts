import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, inject  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {DialogOverviewExampleDialog} from '../../certificaciones/informacion/informacion.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

interface Option {
  value: string;
  viewValue: string;
}
interface ContexturaFisica {
  alturaMin: number;
  alturaMax: number;
  pesoMin: number;
  pesoMax: number;
  puntaje: number;
}

interface TablaFlexiones {
  [nota: number]: {
    "3ER_AM"?: number;
    "2DO_AM"?: number;
    "1ER_AM"?: number;
  };
}

interface TablaMarchaRapida {
  [nota: number]: Partial<Record<Grado, string>>;
}
export interface DialogData {
  jefe: string;
  comandante: string;
}

type Grado = "3ER_AM" | "2DO_AM" | "1ER_AM";
type Genero = "Masculino" | "Femenino";

import { MatIconModule } from '@angular/material/icon';
import { AdminRoutingModule } from "../../admin/admin-routing.module";

@Component({
  selector: 'app-cargado',
  imports: [MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, MatButtonModule, CommonModule, MatIconModule, AdminRoutingModule],
  templateUrl: './cargado.component.html',
  styleUrl: './cargado.component.scss'
})

export class CargadoComponent implements OnInit, OnDestroy {
  @ViewChild('pdfContentEFM', { static: false }) pdfContentEFM!: ElementRef;
  generandoPDF = false;
  readonly jefe = signal('');
  readonly comandante = signal('');
  datosEFM: Record<string, any> = {};
  vistaSeleccionada: string = 'academico';
  today: Date = new Date();
  options: Option[] = [
    { value: 'primerSemestre', viewValue: 'Primer Semestre' },
    { value: 'segundoSemestre', viewValue: 'Segundo Semestre' },
    { value: 'tercerSemestre', viewValue: 'Tercer Semestre' },
    { value: 'cuartoSemestre', viewValue: 'Cuarto Semestre' },
    { value: 'quintoSemestre', viewValue: 'Quinto Semestre' },
    { value: 'sextoSemestre', viewValue: 'Sexto Semestre' },
    { value: 'basico', viewValue: 'Básico' },
    { value: 'avanzado', viewValue: 'Avanzado' }
  ];

  tablaFlexionesM: TablaFlexiones = {
    100: { "3ER_AM": 69, "2DO_AM": 68, "1ER_AM": 67 },
    98:  { "3ER_AM": 68, "2DO_AM": 67, "1ER_AM": 66 },
    96:  { "3ER_AM": 67, "2DO_AM": 66, "1ER_AM": 65 },
    94:  { "3ER_AM": 66, "2DO_AM": 65, "1ER_AM": 64 },
    92:  { "3ER_AM": 65, "2DO_AM": 64, "1ER_AM": 63 },
    90:  { "3ER_AM": 64, "2DO_AM": 63, "1ER_AM": 62 },
    88:  { "3ER_AM": 63, "2DO_AM": 62, "1ER_AM": 61 },
    86:  { "3ER_AM": 62, "2DO_AM": 61, "1ER_AM": 60 },
    84:  { "3ER_AM": 61, "2DO_AM": 60, "1ER_AM": 59 },
    82:  { "3ER_AM": 60, "2DO_AM": 59, "1ER_AM": 58 },
    80:  { "3ER_AM": 59, "2DO_AM": 58, "1ER_AM": 57 },
    78:  { "3ER_AM": 58, "2DO_AM": 57, "1ER_AM": 56 },
    76:  { "3ER_AM": 57, "2DO_AM": 56, "1ER_AM": 55 },
    74:  { "3ER_AM": 56, "2DO_AM": 55, "1ER_AM": 54 },
    72:  { "3ER_AM": 55, "2DO_AM": 54, "1ER_AM": 53 },
    70:  { "3ER_AM": 54, "2DO_AM": 53, "1ER_AM": 52 },
    68:  { "3ER_AM": 53, "2DO_AM": 52, "1ER_AM": 51 },
    66:  { "3ER_AM": 52, "2DO_AM": 51, "1ER_AM": 50 },
    64:  { "3ER_AM": 51, "2DO_AM": 50, "1ER_AM": 49 },
    62:  { "3ER_AM": 50, "2DO_AM": 49, "1ER_AM": 48 },
    60:  { "3ER_AM": 49, "2DO_AM": 48, "1ER_AM": 47 },
    58:  { "3ER_AM": 48, "2DO_AM": 47, "1ER_AM": 46 },
    56:  { "3ER_AM": 47, "2DO_AM": 46, "1ER_AM": 45 },
    54:  { "3ER_AM": 46, "2DO_AM": 45, "1ER_AM": 44 },
    52:  { "3ER_AM": 45, "2DO_AM": 44, "1ER_AM": 43 },
    50:  { "3ER_AM": 44, "2DO_AM": 43, "1ER_AM": 42 },
    48:  { "3ER_AM": 43, "2DO_AM": 42, "1ER_AM": 41 },
    46:  { "3ER_AM": 42, "2DO_AM": 41, "1ER_AM": 40 },
    44:  { "3ER_AM": 41, "2DO_AM": 40, "1ER_AM": 39 },
    42:  { "3ER_AM": 40, "2DO_AM": 39, "1ER_AM": 38 },
    40:  { "3ER_AM": 39, "2DO_AM": 38, "1ER_AM": 37 },
    38:  { "3ER_AM": 38, "2DO_AM": 37, "1ER_AM": 36 },
    36:  { "3ER_AM": 37, "2DO_AM": 36, "1ER_AM": 35 },
    34:  { "3ER_AM": 36, "2DO_AM": 35, "1ER_AM": 34 },
    32:  { "3ER_AM": 35, "2DO_AM": 34, "1ER_AM": 33 },
    30:  { "3ER_AM": 34, "2DO_AM": 33, "1ER_AM": 32 },
    28:  { "3ER_AM": 33, "2DO_AM": 32, "1ER_AM": 31 },
    26:  { "3ER_AM": 32, "2DO_AM": 31, "1ER_AM": 30 },
    24:  { "3ER_AM": 31, "2DO_AM": 30, "1ER_AM": 29 },
    22:  { "3ER_AM": 30, "2DO_AM": 29, "1ER_AM": 28 },
    20:  { "3ER_AM": 29, "2DO_AM": 28, "1ER_AM": 27 },
    18:  { "3ER_AM": 28, "2DO_AM": 27, "1ER_AM": 26 },
    17:  { "3ER_AM": 27, "2DO_AM": 26, "1ER_AM": 25 },
    16:  { "3ER_AM": 26, "2DO_AM": 25, "1ER_AM": 24 },
    15:  { "3ER_AM": 25, "2DO_AM": 24, "1ER_AM": 23 },
    14:  { "3ER_AM": 24, "2DO_AM": 23, "1ER_AM": 22 },
    13:  { "3ER_AM": 23, "2DO_AM": 22, "1ER_AM": 21 },
    12:  { "3ER_AM": 22, "2DO_AM": 21, "1ER_AM": 20 },
    11:  { "3ER_AM": 21, "2DO_AM": 20, "1ER_AM": 19 },
    10:  { "3ER_AM": 20, "2DO_AM": 19, "1ER_AM": 18 },
    9:   { "3ER_AM": 19, "2DO_AM": 18, "1ER_AM": 17 },
    8:   { "3ER_AM": 18, "2DO_AM": 17, "1ER_AM": 16 },
    7:   { "3ER_AM": 17, "2DO_AM": 16, "1ER_AM": 15 },
    6:   { "3ER_AM": 16, "2DO_AM": 15, "1ER_AM": 14 },
    5:   { "3ER_AM": 15, "2DO_AM": 14, "1ER_AM": 13 },
    4:   { "3ER_AM": 14, "2DO_AM": 13, "1ER_AM": 12 },
    3:   { "3ER_AM": 13, "2DO_AM": 12, "1ER_AM": 11 },
    2:   { "3ER_AM": 12, "2DO_AM": 11, "1ER_AM": 10 },
    1:   { "3ER_AM": 11, "2DO_AM": 10, "1ER_AM": 9 },
    0:   { "3ER_AM": 10, "2DO_AM": 9,  "1ER_AM": 8 }
  };

  tablaFlexionesF: TablaFlexiones = {
    100: { "3ER_AM": 69, "2DO_AM": 68, "1ER_AM": 67 },
    98:  { "3ER_AM": 68, "2DO_AM": 67, "1ER_AM": 66 },
    96:  { "3ER_AM": 67, "2DO_AM": 66, "1ER_AM": 65 },
    94:  { "3ER_AM": 66, "2DO_AM": 65, "1ER_AM": 64 },
    92:  { "3ER_AM": 65, "2DO_AM": 64, "1ER_AM": 63 },
    90:  { "3ER_AM": 64, "2DO_AM": 63, "1ER_AM": 62 },
    88:  { "3ER_AM": 63, "2DO_AM": 62, "1ER_AM": 61 },
    86:  { "3ER_AM": 62, "2DO_AM": 61, "1ER_AM": 60 },
    84:  { "3ER_AM": 61, "2DO_AM": 60, "1ER_AM": 59 },
    82:  { "3ER_AM": 60, "2DO_AM": 59, "1ER_AM": 58 },
    80:  { "3ER_AM": 59, "2DO_AM": 58, "1ER_AM": 57 },
    78:  { "3ER_AM": 58, "2DO_AM": 57, "1ER_AM": 56 },
    76:  { "3ER_AM": 57, "2DO_AM": 56, "1ER_AM": 55 },
    74:  { "3ER_AM": 56, "2DO_AM": 55, "1ER_AM": 54 },
    72:  { "3ER_AM": 55, "2DO_AM": 54, "1ER_AM": 53 },
    70:  { "3ER_AM": 54, "2DO_AM": 53, "1ER_AM": 52 },
    68:  { "3ER_AM": 53, "2DO_AM": 52, "1ER_AM": 51 },
    66:  { "3ER_AM": 52, "2DO_AM": 51, "1ER_AM": 50 },
    64:  { "3ER_AM": 51, "2DO_AM": 50, "1ER_AM": 49 },
    62:  { "3ER_AM": 50, "2DO_AM": 49, "1ER_AM": 48 },
    60:  { "3ER_AM": 49, "2DO_AM": 48, "1ER_AM": 47 },
    58:  { "3ER_AM": 48, "2DO_AM": 47, "1ER_AM": 46 },
    56:  { "3ER_AM": 47, "2DO_AM": 46, "1ER_AM": 45 },
    54:  { "3ER_AM": 46, "2DO_AM": 45, "1ER_AM": 44 },
    52:  { "3ER_AM": 45, "2DO_AM": 44, "1ER_AM": 43 },
    50:  { "3ER_AM": 44, "2DO_AM": 43, "1ER_AM": 42 },
    48:  { "3ER_AM": 43, "2DO_AM": 42, "1ER_AM": 41 },
    46:  { "3ER_AM": 42, "2DO_AM": 41, "1ER_AM": 40 },
    44:  { "3ER_AM": 41, "2DO_AM": 40, "1ER_AM": 39 },
    42:  { "3ER_AM": 40, "2DO_AM": 39, "1ER_AM": 38 },
    40:  { "3ER_AM": 38, "2DO_AM": 36, "1ER_AM": 34 },
    38:  { "3ER_AM": 36, "2DO_AM": 34, "1ER_AM": 32 },
    36:  { "3ER_AM": 34, "2DO_AM": 32, "1ER_AM": 30 },
    34:  { "3ER_AM": 32, "2DO_AM": 30, "1ER_AM": 28 },
    32:  { "3ER_AM": 30, "2DO_AM": 28, "1ER_AM": 26 },
    30:  { "3ER_AM": 28, "2DO_AM": 26, "1ER_AM": 24 },
    28:  { "3ER_AM": 26, "2DO_AM": 24, "1ER_AM": 22 },
    26:  { "3ER_AM": 24, "2DO_AM": 22, "1ER_AM": 20 },
    24:  { "3ER_AM": 22, "2DO_AM": 20, "1ER_AM": 18 },
    22:  { "3ER_AM": 20, "2DO_AM": 18, "1ER_AM": 16 },
    20:  { "3ER_AM": 18, "2DO_AM": 16, "1ER_AM": 14 },
    18:  { "3ER_AM": 16, "2DO_AM": 14, "1ER_AM": 12 },
    16:  { "3ER_AM": 14, "2DO_AM": 12, "1ER_AM": 10 },
    14:  { "3ER_AM": 12, "2DO_AM": 10, "1ER_AM": 9 },
    12:  { "3ER_AM": 10, "2DO_AM": 9,  "1ER_AM": 8 },
    10:  { "3ER_AM": 9,  "2DO_AM": 8,  "1ER_AM": 7 },
    8:   { "3ER_AM": 7,  "2DO_AM": 6,  "1ER_AM": 5 },
    6:   { "3ER_AM": 5,  "2DO_AM": 4,  "1ER_AM": 3 },
    4:   { "3ER_AM": 3,  "2DO_AM": 2,  "1ER_AM": 1 },
    2:   { "3ER_AM": 1,  "2DO_AM": 0,  "1ER_AM": 0 },
    0:   { "3ER_AM": 0,  "2DO_AM": 0,  "1ER_AM": 0 }
  };
  
tablaFlexionesBarraM: TablaFlexiones = {
  100:  { "3ER_AM": 11,  "2DO_AM": 10,  "1ER_AM": 9 },
  90:   { "3ER_AM": 10,  "2DO_AM": 9,   "1ER_AM": undefined},
  88.8: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 8 },
  81:   { "3ER_AM": 9,   "2DO_AM": undefined, "1ER_AM": undefined },
  80:   { "3ER_AM": undefined, "2DO_AM": 8,   "1ER_AM": undefined },
  77.7: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 7 },
  72:   { "3ER_AM": 8,   "2DO_AM": undefined, "1ER_AM": undefined },
  70:   { "3ER_AM": undefined, "2DO_AM": 7,   "1ER_AM": undefined },
  66.6: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 6 },
  63:   { "3ER_AM": 7,   "2DO_AM": undefined, "1ER_AM": undefined },
  60:   { "3ER_AM": undefined, "2DO_AM": 6,   "1ER_AM": undefined },
  55.5: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 5 },
  54:   { "3ER_AM": 6,   "2DO_AM": undefined, "1ER_AM": undefined },
  50:   { "3ER_AM": undefined, "2DO_AM": 5,   "1ER_AM": undefined },
  45:   { "3ER_AM": 5,   "2DO_AM": undefined, "1ER_AM": undefined },
  44.4: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 4 },
  40:   { "3ER_AM": undefined, "2DO_AM": 4,   "1ER_AM": undefined },
  36:   { "3ER_AM": 4,   "2DO_AM": undefined, "1ER_AM": undefined },
  33.3: { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 3 },
  30:   { "3ER_AM": undefined, "2DO_AM": 3,   "1ER_AM": undefined },
  27:   { "3ER_AM": 3,   "2DO_AM": undefined, "1ER_AM": undefined },
  22.2:{ "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 2 },
  20:   { "3ER_AM": undefined, "2DO_AM": 2,   "1ER_AM": undefined },
  18:   { "3ER_AM": 2,   "2DO_AM": undefined, "1ER_AM": undefined },
  11.1:{ "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 1 },
  10:   { "3ER_AM": undefined, "2DO_AM": 1,   "1ER_AM": undefined },
  9:    { "3ER_AM": 1,   "2DO_AM": undefined, "1ER_AM": undefined },
  0.1:    { "3ER_AM": 0,   "2DO_AM": 0,   "1ER_AM": 0 }
};
tablaFlexionesBarraF: TablaFlexiones = {
  100:   { "3ER_AM": 9,  "2DO_AM": 8,  "1ER_AM": 7 },
  88.8:  { "3ER_AM": 8,  "2DO_AM": undefined, "1ER_AM": undefined },
  87.5:  { "3ER_AM": undefined, "2DO_AM": 7,  "1ER_AM": undefined },
  85.8:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 6 },
  77.7:  { "3ER_AM": 7,  "2DO_AM": undefined, "1ER_AM": undefined },
  75:    { "3ER_AM": undefined, "2DO_AM": 6,  "1ER_AM": undefined },
  71.5:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 5 },
  66.6:  { "3ER_AM": 6,  "2DO_AM": undefined, "1ER_AM": undefined },
  62.5:  { "3ER_AM": undefined, "2DO_AM": 5,  "1ER_AM": undefined },
  57.2:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 4 },
  55.5:  { "3ER_AM": 5,  "2DO_AM": undefined, "1ER_AM": undefined },
  50:    { "3ER_AM": undefined, "2DO_AM": 4,  "1ER_AM": undefined },
  44.4:  { "3ER_AM": 4,  "2DO_AM": undefined, "1ER_AM": undefined },
  42.9:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 3 },
  37.5:  { "3ER_AM": undefined, "2DO_AM": 3,  "1ER_AM": undefined },
  33.3:  { "3ER_AM": 3,  "2DO_AM": undefined, "1ER_AM": undefined },
  28.6:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 2 },
  25:    { "3ER_AM": undefined, "2DO_AM": 2,  "1ER_AM": undefined },
  22.2:  { "3ER_AM": 2,  "2DO_AM": undefined, "1ER_AM": undefined },
  14.3:  { "3ER_AM": undefined, "2DO_AM": undefined, "1ER_AM": 1 },
  12.5:  { "3ER_AM": undefined, "2DO_AM": 1,  "1ER_AM": undefined },
  11.1:  { "3ER_AM": 1,  "2DO_AM": undefined, "1ER_AM": undefined },
  0.1:     { "3ER_AM": 0,  "2DO_AM": 0,  "1ER_AM": 0 }
};

tablaMarchaRapidaHH: TablaMarchaRapida = {
  100: { "3ER_AM": "01:28:20", "2DO_AM": "01:31:40", "1ER_AM": "01:33:00" },
  99: { "3ER_AM": "01:28:40", "2DO_AM": "01:32:00", "1ER_AM": "01:33:20" },
  98: { "3ER_AM": "01:29:00", "2DO_AM": "01:32:20", "1ER_AM": "01:33:40" },
  97: { "3ER_AM": "01:29:20", "2DO_AM": "01:32:40", "1ER_AM": "01:34:00" },
  96: { "3ER_AM": "01:29:40", "2DO_AM": "01:33:00", "1ER_AM": "01:34:20" },
  95: { "3ER_AM": "01:30:00", "2DO_AM": "01:33:20", "1ER_AM": "01:34:40" },
  94: { "3ER_AM": "01:30:20", "2DO_AM": "01:33:40", "1ER_AM": "01:35:00" },
  93: { "3ER_AM": "01:30:40", "2DO_AM": "01:34:00", "1ER_AM": "01:35:20" },
  92: { "3ER_AM": "01:31:00", "2DO_AM": "01:34:20", "1ER_AM": "01:35:40" },
  91: { "3ER_AM": "01:31:20", "2DO_AM": "01:34:40", "1ER_AM": "01:36:00" },
  90: { "3ER_AM": "01:31:40", "2DO_AM": "01:35:00", "1ER_AM": "01:36:20" },
  89: { "3ER_AM": "01:32:00", "2DO_AM": "01:35:20", "1ER_AM": "01:36:40" },
  88: { "3ER_AM": "01:32:20", "2DO_AM": "01:35:40", "1ER_AM": "01:37:00" },
  87: { "3ER_AM": "01:32:40", "2DO_AM": "01:36:00", "1ER_AM": "01:37:20" },
  86: { "3ER_AM": "01:33:00", "2DO_AM": "01:36:20", "1ER_AM": "01:37:40" },
  85: { "3ER_AM": "01:33:20", "2DO_AM": "01:36:40", "1ER_AM": "01:38:00" },
  84: { "3ER_AM": "01:33:40", "2DO_AM": "01:37:00", "1ER_AM": "01:38:20" },
  83: { "3ER_AM": "01:34:00", "2DO_AM": "01:37:20", "1ER_AM": "01:38:40" },
  82: { "3ER_AM": "01:34:20", "2DO_AM": "01:37:40", "1ER_AM": "01:39:00" },
  81: { "3ER_AM": "01:34:40", "2DO_AM": "01:38:00", "1ER_AM": "01:39:20" },
  80: { "3ER_AM": "01:35:00", "2DO_AM": "01:38:20", "1ER_AM": "01:39:40" },
  79: { "3ER_AM": "01:35:20", "2DO_AM": "01:38:40", "1ER_AM": "01:40:00" },
  78: { "3ER_AM": "01:35:40", "2DO_AM": "01:39:00", "1ER_AM": "01:40:20" },
  77: { "3ER_AM": "01:36:00", "2DO_AM": "01:39:20", "1ER_AM": "01:40:40" },
  76: { "3ER_AM": "01:36:20", "2DO_AM": "01:39:40", "1ER_AM": "01:41:00" },
  75: { "3ER_AM": "01:36:40", "2DO_AM": "01:40:00", "1ER_AM": "01:41:20" },
  74: { "3ER_AM": "01:37:00", "2DO_AM": "01:40:20", "1ER_AM": "01:41:40" },
  73: { "3ER_AM": "01:37:20", "2DO_AM": "01:40:40", "1ER_AM": "01:42:00" },
  72: { "3ER_AM": "01:37:40", "2DO_AM": "01:41:00", "1ER_AM": "01:42:20" },
  71: { "3ER_AM": "01:38:00", "2DO_AM": "01:41:20", "1ER_AM": "01:42:40" },
  70: { "3ER_AM": "01:38:20", "2DO_AM": "01:41:40", "1ER_AM": "01:43:00" },
  69: { "3ER_AM": "01:38:40", "2DO_AM": "01:42:00", "1ER_AM": "01:43:20" },
  68: { "3ER_AM": "01:39:00", "2DO_AM": "01:42:20", "1ER_AM": "01:43:40" },
  67: { "3ER_AM": "01:39:20", "2DO_AM": "01:42:40", "1ER_AM": "01:44:00" },
  66: { "3ER_AM": "01:39:40", "2DO_AM": "01:43:00", "1ER_AM": "01:44:20" },
  65: { "3ER_AM": "01:40:00", "2DO_AM": "01:43:20", "1ER_AM": "01:44:40" },
  64: { "3ER_AM": "01:40:20", "2DO_AM": "01:43:40", "1ER_AM": "01:45:00" },
  63: { "3ER_AM": "01:40:40", "2DO_AM": "01:44:00", "1ER_AM": "01:45:20" },
  62: { "3ER_AM": "01:41:00", "2DO_AM": "01:44:20", "1ER_AM": "01:45:40" },
  61: { "3ER_AM": "01:41:20", "2DO_AM": "01:44:40", "1ER_AM": "01:46:00" },
  60: { "3ER_AM": "01:41:40", "2DO_AM": "01:45:00", "1ER_AM": "01:46:20" },
  59: { "3ER_AM": "01:42:00", "2DO_AM": "01:45:20", "1ER_AM": "01:46:40" },
  58: { "3ER_AM": "01:42:20", "2DO_AM": "01:45:40", "1ER_AM": "01:47:00" },
  57: { "3ER_AM": "01:42:40", "2DO_AM": "01:46:00", "1ER_AM": "01:47:20" },
  56: { "3ER_AM": "01:43:00", "2DO_AM": "01:46:20", "1ER_AM": "01:47:40" },
  55: { "3ER_AM": "01:43:20", "2DO_AM": "01:46:40", "1ER_AM": "01:48:00" },
  54: { "3ER_AM": "01:43:40", "2DO_AM": "01:47:00", "1ER_AM": "01:48:20" },
  53: { "3ER_AM": "01:44:00", "2DO_AM": "01:47:20", "1ER_AM": "01:48:40" },
  52: { "3ER_AM": "01:44:20", "2DO_AM": "01:47:40", "1ER_AM": "01:49:00" },
  51: { "3ER_AM": "01:44:40", "2DO_AM": "01:48:00", "1ER_AM": "01:49:20" },
  50: { "3ER_AM": "01:45:00", "2DO_AM": "01:48:20", "1ER_AM": "01:49:40" },
  49: { "3ER_AM": "01:45:20", "2DO_AM": "01:48:40", "1ER_AM": "01:50:00" },
  48: { "3ER_AM": "01:45:40", "2DO_AM": "01:49:00", "1ER_AM": "01:50:20" },
  47: { "3ER_AM": "01:46:00", "2DO_AM": "01:49:20", "1ER_AM": "01:50:40" },
  46: { "3ER_AM": "01:46:20", "2DO_AM": "01:49:40", "1ER_AM": "01:51:00" },
  45: { "3ER_AM": "01:46:40", "2DO_AM": "01:50:00", "1ER_AM": "01:51:20" },
  44: { "3ER_AM": "01:47:00", "2DO_AM": "01:50:20", "1ER_AM": "01:51:40" },
  43: { "3ER_AM": "01:47:20", "2DO_AM": "01:50:40", "1ER_AM": "01:52:00" },
  42: { "3ER_AM": "01:47:40", "2DO_AM": "01:51:00", "1ER_AM": "01:52:20" },
  41: { "3ER_AM": "01:48:00", "2DO_AM": "01:51:20", "1ER_AM": "01:52:40" },
  40: { "3ER_AM": "01:48:20", "2DO_AM": "01:51:40", "1ER_AM": "01:53:00" },
  39: { "3ER_AM": "01:48:40", "2DO_AM": "01:52:00", "1ER_AM": "01:53:20" },
  38: { "3ER_AM": "01:49:00", "2DO_AM": "01:52:20", "1ER_AM": "01:53:40" },
  37: { "3ER_AM": "01:49:20", "2DO_AM": "01:52:40", "1ER_AM": "01:54:00" },
  36: { "3ER_AM": "01:49:40", "2DO_AM": "01:53:00", "1ER_AM": "01:54:20" },
  35: { "3ER_AM": "01:50:00", "2DO_AM": "01:53:20", "1ER_AM": "01:54:40" },
  34: { "3ER_AM": "01:50:20", "2DO_AM": "01:53:40", "1ER_AM": "01:55:00" },
  33: { "3ER_AM": "01:50:40", "2DO_AM": "01:54:00", "1ER_AM": "01:55:20" },
  32: { "3ER_AM": "01:51:00", "2DO_AM": "01:54:20", "1ER_AM": "01:55:40" },
  31: { "3ER_AM": "01:51:20", "2DO_AM": "01:54:40", "1ER_AM": "01:56:00" },
  30: { "3ER_AM": "01:51:40", "2DO_AM": "01:55:00", "1ER_AM": "01:56:20" },
  29: { "3ER_AM": "01:52:00", "2DO_AM": "01:55:20", "1ER_AM": "01:56:40" },
  28: { "3ER_AM": "01:52:20", "2DO_AM": "01:55:40", "1ER_AM": "01:57:00" },
  27: { "3ER_AM": "01:52:40", "2DO_AM": "01:56:00", "1ER_AM": "01:57:20" },
  26: { "3ER_AM": "01:53:00", "2DO_AM": "01:56:20", "1ER_AM": "01:57:40" },
  25: { "3ER_AM": "01:53:20", "2DO_AM": "01:56:40", "1ER_AM": "01:58:00" },
  24: { "3ER_AM": "01:53:40", "2DO_AM": "01:57:00", "1ER_AM": "01:58:20" },
  23: { "3ER_AM": "01:54:00", "2DO_AM": "01:57:20", "1ER_AM": "01:58:40" },
  22: { "3ER_AM": "01:54:20", "2DO_AM": "01:57:40", "1ER_AM": "01:59:00" },
  21: { "3ER_AM": "01:54:40", "2DO_AM": "01:58:00", "1ER_AM": "01:59:20" },
  20: { "3ER_AM": "01:55:00", "2DO_AM": "01:58:20", "1ER_AM": "01:59:40" },
  19: { "3ER_AM": "01:55:20", "2DO_AM": "01:58:40", "1ER_AM": "02:00:00" },
  18: { "3ER_AM": "01:55:40", "2DO_AM": "01:59:00", "1ER_AM": "02:00:20" },
  17: { "3ER_AM": "01:56:00", "2DO_AM": "01:59:20", "1ER_AM": "02:00:40" },
  16: { "3ER_AM": "01:56:20", "2DO_AM": "01:59:40", "1ER_AM": "02:01:00" },
  15: { "3ER_AM": "01:56:40", "2DO_AM": "02:00:00", "1ER_AM": "02:01:20" },
  14: { "3ER_AM": "01:57:00", "2DO_AM": "02:00:20", "1ER_AM": "02:01:40" },
  13: { "3ER_AM": "01:57:20", "2DO_AM": "02:00:40", "1ER_AM": "02:02:00" },
  12: { "3ER_AM": "01:57:40", "2DO_AM": "02:01:00", "1ER_AM": "02:02:20" },
  11: { "3ER_AM": "01:58:00", "2DO_AM": "02:01:20", "1ER_AM": "02:02:40" },
  10: { "3ER_AM": "01:58:20", "2DO_AM": "02:01:40", "1ER_AM": "02:03:00" },
  9: { "3ER_AM": "01:58:40", "2DO_AM": "02:02:00", "1ER_AM": "02:03:20" },
  8: { "3ER_AM": "01:59:00", "2DO_AM": "02:02:20", "1ER_AM": "02:03:40" },
  7: { "3ER_AM": "01:59:20", "2DO_AM": "02:02:40", "1ER_AM": "02:04:00" },
  6: { "3ER_AM": "01:59:40", "2DO_AM": "02:03:00", "1ER_AM": "02:04:20" },
  5: { "3ER_AM": "02:00:00", "2DO_AM": "02:03:20", "1ER_AM": "02:04:40" },
  4: { "3ER_AM": "02:00:20", "2DO_AM": "02:03:40", "1ER_AM": "02:05:00" },
  3: { "3ER_AM": "02:00:40", "2DO_AM": "02:04:00", "1ER_AM": "02:05:20" },
  2: { "3ER_AM": "02:01:00", "2DO_AM": "02:04:20", "1ER_AM": "02:05:40" },
  1: { "3ER_AM": "02:01:20", "2DO_AM": "02:04:40", "1ER_AM": "02:06:00" },
  0: { "3ER_AM": "02:01:40", "2DO_AM": "02:05:00", "1ER_AM": "02:06:20" },
};

tablaCuerdaM: TablaFlexiones = {
  100: { "3ER_AM": 27.00, "2DO_AM": 30.00, "1ER_AM": 33.00 },
  99: { "3ER_AM": 27.20, "2DO_AM": 30.20, "1ER_AM": 33.20 },
  98: { "3ER_AM": 27.40, "2DO_AM": 30.40, "1ER_AM": 33.40 },
  97: { "3ER_AM": 27.60, "2DO_AM": 30.60, "1ER_AM": 33.60 },
  96: { "3ER_AM": 27.80, "2DO_AM": 30.80, "1ER_AM": 33.80 },
  95: { "3ER_AM": 28.00, "2DO_AM": 31.00, "1ER_AM": 34.00 },
  94: { "3ER_AM": 28.20, "2DO_AM": 31.20, "1ER_AM": 34.20 },
  93: { "3ER_AM": 28.40, "2DO_AM": 31.40, "1ER_AM": 34.40 },
  92: { "3ER_AM": 28.60, "2DO_AM": 31.60, "1ER_AM": 34.60 },
  91: { "3ER_AM": 28.80, "2DO_AM": 31.80, "1ER_AM": 34.80 },
  90: { "3ER_AM": 29.00, "2DO_AM": 32.00, "1ER_AM": 35.00 },
  89: { "3ER_AM": 29.20, "2DO_AM": 32.20, "1ER_AM": 35.20 },
  88: { "3ER_AM": 29.40, "2DO_AM": 32.40, "1ER_AM": 35.40 },
  87: { "3ER_AM": 29.60, "2DO_AM": 32.60, "1ER_AM": 35.60 },
  86: { "3ER_AM": 29.80, "2DO_AM": 32.80, "1ER_AM": 35.80 },
  85: { "3ER_AM": 30.00, "2DO_AM": 33.00, "1ER_AM": 36.00 },
  84: { "3ER_AM": 30.20, "2DO_AM": 33.20, "1ER_AM": 36.20 },
  83: { "3ER_AM": 30.40, "2DO_AM": 33.40, "1ER_AM": 36.40 },
  82: { "3ER_AM": 30.60, "2DO_AM": 33.60, "1ER_AM": 36.60 },
  81: { "3ER_AM": 30.80, "2DO_AM": 33.80, "1ER_AM": 36.80 },
  80: { "3ER_AM": 31.00, "2DO_AM": 34.00, "1ER_AM": 37.00 },
  79: { "3ER_AM": 31.20, "2DO_AM": 34.20, "1ER_AM": 37.20 },
  78: { "3ER_AM": 31.40, "2DO_AM": 34.40, "1ER_AM": 37.40 },
  77: { "3ER_AM": 31.60, "2DO_AM": 34.60, "1ER_AM": 37.60 },
  76: { "3ER_AM": 31.80, "2DO_AM": 34.80, "1ER_AM": 37.80 },
  75: { "3ER_AM": 32.00, "2DO_AM": 35.00, "1ER_AM": 38.00 },
  74: { "3ER_AM": 32.20, "2DO_AM": 35.20, "1ER_AM": 38.20 },
  73: { "3ER_AM": 32.40, "2DO_AM": 35.40, "1ER_AM": 38.40 },
  72: { "3ER_AM": 32.60, "2DO_AM": 35.60, "1ER_AM": 38.60 },
  71: { "3ER_AM": 32.80, "2DO_AM": 35.80, "1ER_AM": 38.80 },
  70: { "3ER_AM": 33.00, "2DO_AM": 36.00, "1ER_AM": 39.00 },
  69: { "3ER_AM": 33.20, "2DO_AM": 36.20, "1ER_AM": 39.20 },
  68: { "3ER_AM": 33.40, "2DO_AM": 36.40, "1ER_AM": 39.40 },
  67: { "3ER_AM": 33.60, "2DO_AM": 36.60, "1ER_AM": 39.60 },
  66: { "3ER_AM": 33.80, "2DO_AM": 36.80, "1ER_AM": 39.80 },
  65: { "3ER_AM": 34.00, "2DO_AM": 37.00, "1ER_AM": 40.00 },
  64: { "3ER_AM": 34.20, "2DO_AM": 37.20, "1ER_AM": 40.20 },
  63: { "3ER_AM": 34.40, "2DO_AM": 37.40, "1ER_AM": 40.40 },
  62: { "3ER_AM": 34.60, "2DO_AM": 37.60, "1ER_AM": 40.60 },
  61: { "3ER_AM": 34.80, "2DO_AM": 37.80, "1ER_AM": 40.80 },
  60: { "3ER_AM": 35.00, "2DO_AM": 38.00, "1ER_AM": 41.00 },
  59: { "3ER_AM": 35.20, "2DO_AM": 38.20, "1ER_AM": 41.20 },
  58: { "3ER_AM": 35.40, "2DO_AM": 38.40, "1ER_AM": 41.40 },
  57: { "3ER_AM": 35.60, "2DO_AM": 38.60, "1ER_AM": 41.60 },
  56: { "3ER_AM": 35.80, "2DO_AM": 38.80, "1ER_AM": 41.80 },
  55: { "3ER_AM": 36.00, "2DO_AM": 39.00, "1ER_AM": 42.00 },
  54: { "3ER_AM": 36.20, "2DO_AM": 39.20, "1ER_AM": 42.20 },
  53: { "3ER_AM": 36.40, "2DO_AM": 39.40, "1ER_AM": 42.40 },
  52: { "3ER_AM": 36.60, "2DO_AM": 39.60, "1ER_AM": 42.60 },
  51: { "3ER_AM": 36.80, "2DO_AM": 39.80, "1ER_AM": 42.80 },
  50: { "3ER_AM": 37.00, "2DO_AM": 40.00, "1ER_AM": 43.00 },
  49: { "3ER_AM": 37.20, "2DO_AM": 40.20, "1ER_AM": 43.20 },
  48: { "3ER_AM": 37.40, "2DO_AM": 40.40, "1ER_AM": 43.40 },
  47: { "3ER_AM": 37.60, "2DO_AM": 40.60, "1ER_AM": 43.60 },
  46: { "3ER_AM": 37.80, "2DO_AM": 40.80, "1ER_AM": 43.80 },
  45: { "3ER_AM": 38.00, "2DO_AM": 41.00, "1ER_AM": 44.00 },
  44: { "3ER_AM": 38.20, "2DO_AM": 41.20, "1ER_AM": 44.20 },
  43: { "3ER_AM": 38.40, "2DO_AM": 41.40, "1ER_AM": 44.40 },
  42: { "3ER_AM": 38.60, "2DO_AM": 41.60, "1ER_AM": 44.60 },
  41: { "3ER_AM": 38.80, "2DO_AM": 41.80, "1ER_AM": 44.80 },
  40: { "3ER_AM": 39.00, "2DO_AM": 42.00, "1ER_AM": 45.00 },
  39: { "3ER_AM": 39.20, "2DO_AM": 42.20, "1ER_AM": 45.20 },
  38: { "3ER_AM": 39.40, "2DO_AM": 42.40, "1ER_AM": 45.40 },
  37: { "3ER_AM": 39.60, "2DO_AM": 42.60, "1ER_AM": 45.60 },
  36: { "3ER_AM": 39.80, "2DO_AM": 42.80, "1ER_AM": 45.80 },
  35: { "3ER_AM": 40.00, "2DO_AM": 43.00, "1ER_AM": 46.00 },
  34: { "3ER_AM": 40.20, "2DO_AM": 43.20, "1ER_AM": 46.20 },
  33: { "3ER_AM": 40.40, "2DO_AM": 43.40, "1ER_AM": 46.40 },
  32: { "3ER_AM": 40.60, "2DO_AM": 43.60, "1ER_AM": 46.60 },
  31: { "3ER_AM": 40.80, "2DO_AM": 43.80, "1ER_AM": 46.80 },
  30: { "3ER_AM": 41.00, "2DO_AM": 44.00, "1ER_AM": 47.00 },
  29: { "3ER_AM": 41.20, "2DO_AM": 44.20, "1ER_AM": 47.20 },
  28: { "3ER_AM": 41.40, "2DO_AM": 44.40, "1ER_AM": 47.40 },
  27: { "3ER_AM": 41.60, "2DO_AM": 44.60, "1ER_AM": 47.60 },
  26: { "3ER_AM": 41.80, "2DO_AM": 44.80, "1ER_AM": 47.80 },
  25: { "3ER_AM": 42.00, "2DO_AM": 45.00, "1ER_AM": 48.00 },
  24: { "3ER_AM": 42.20, "2DO_AM": 45.20, "1ER_AM": 48.20 },
  23: { "3ER_AM": 42.40, "2DO_AM": 45.40, "1ER_AM": 48.40 },
  22: { "3ER_AM": 42.60, "2DO_AM": 45.60, "1ER_AM": 48.60 },
  21: { "3ER_AM": 42.80, "2DO_AM": 45.80, "1ER_AM": 48.80 },
  20: { "3ER_AM": 43.00, "2DO_AM": 46.00, "1ER_AM": 49.00 },
  19: { "3ER_AM": 43.20, "2DO_AM": 46.20, "1ER_AM": 49.20 },
  18: { "3ER_AM": 43.40, "2DO_AM": 46.40, "1ER_AM": 49.40 },
  17: { "3ER_AM": 43.60, "2DO_AM": 46.60, "1ER_AM": 49.60 },
  16: { "3ER_AM": 43.80, "2DO_AM": 46.80, "1ER_AM": 49.80 },
  15: { "3ER_AM": 44.00, "2DO_AM": 47.00, "1ER_AM": 50.00 },
  14: { "3ER_AM": 44.20, "2DO_AM": 47.20, "1ER_AM": 50.20 },
  13: { "3ER_AM": 44.40, "2DO_AM": 47.40, "1ER_AM": 50.40 },
  12: { "3ER_AM": 44.60, "2DO_AM": 47.60, "1ER_AM": 50.60 },
  11: { "3ER_AM": 44.80, "2DO_AM": 47.80, "1ER_AM": 50.80 },
  10: { "3ER_AM": 45.00, "2DO_AM": 48.00, "1ER_AM": 51.00 },
  9: { "3ER_AM": 45.20, "2DO_AM": 48.20, "1ER_AM": 51.20 },
  8: { "3ER_AM": 45.40, "2DO_AM": 48.40, "1ER_AM": 51.40 },
  7: { "3ER_AM": 45.60, "2DO_AM": 48.60, "1ER_AM": 51.60 },
  6: { "3ER_AM": 45.80, "2DO_AM": 48.80, "1ER_AM": 51.80 },
  5: { "3ER_AM": 46.00, "2DO_AM": 49.00, "1ER_AM": 52.00 },
  4: { "3ER_AM": 46.20, "2DO_AM": 49.20, "1ER_AM": 52.20 },
  3: { "3ER_AM": 46.40, "2DO_AM": 49.40, "1ER_AM": 52.40 },
  2: { "3ER_AM": 46.60, "2DO_AM": 49.60, "1ER_AM": 52.60 },
  1: { "3ER_AM": 46.80, "2DO_AM": 49.80, "1ER_AM": 52.80 },
  0: { "3ER_AM": 47.00, "2DO_AM": 50.00, "1ER_AM": 53.00 },
};
tablaCuerdaF: TablaFlexiones = {
  100: { "3ER_AM": 33.00, "2DO_AM": 36.00, "1ER_AM": 39.00 },
  99: { "3ER_AM": 33.20, "2DO_AM": 36.20, "1ER_AM": 39.20 },
  98: { "3ER_AM": 33.40, "2DO_AM": 36.40, "1ER_AM": 39.40 },
  97: { "3ER_AM": 33.60, "2DO_AM": 36.60, "1ER_AM": 39.60 },
  96: { "3ER_AM": 33.80, "2DO_AM": 36.80, "1ER_AM": 39.80 },
  95: { "3ER_AM": 34.00, "2DO_AM": 37.00, "1ER_AM": 40.00 },
  94: { "3ER_AM": 34.20, "2DO_AM": 37.20, "1ER_AM": 40.20 },
  93: { "3ER_AM": 34.40, "2DO_AM": 37.40, "1ER_AM": 40.40 },
  92: { "3ER_AM": 34.60, "2DO_AM": 37.60, "1ER_AM": 40.60 },
  91: { "3ER_AM": 34.80, "2DO_AM": 37.80, "1ER_AM": 40.80 },
  90: { "3ER_AM": 35.00, "2DO_AM": 38.00, "1ER_AM": 41.00 },
  89: { "3ER_AM": 35.20, "2DO_AM": 38.20, "1ER_AM": 41.20 },
  88: { "3ER_AM": 35.40, "2DO_AM": 38.40, "1ER_AM": 41.40 },
  87: { "3ER_AM": 35.60, "2DO_AM": 38.60, "1ER_AM": 41.60 },
  86: { "3ER_AM": 35.80, "2DO_AM": 38.80, "1ER_AM": 41.80 },
  85: { "3ER_AM": 36.00, "2DO_AM": 39.00, "1ER_AM": 42.00 },
  84: { "3ER_AM": 36.20, "2DO_AM": 39.20, "1ER_AM": 42.20 },
  83: { "3ER_AM": 36.40, "2DO_AM": 39.40, "1ER_AM": 42.40 },
  82: { "3ER_AM": 36.60, "2DO_AM": 39.60, "1ER_AM": 42.60 },
  81: { "3ER_AM": 36.80, "2DO_AM": 39.80, "1ER_AM": 42.80 },
  80: { "3ER_AM": 37.00, "2DO_AM": 40.00, "1ER_AM": 43.00 },
  79: { "3ER_AM": 37.20, "2DO_AM": 40.20, "1ER_AM": 43.20 },
  78: { "3ER_AM": 37.40, "2DO_AM": 40.40, "1ER_AM": 43.40 },
  77: { "3ER_AM": 37.60, "2DO_AM": 40.60, "1ER_AM": 43.60 },
  76: { "3ER_AM": 37.80, "2DO_AM": 40.80, "1ER_AM": 43.80 },
  75: { "3ER_AM": 38.00, "2DO_AM": 41.00, "1ER_AM": 44.00 },
  74: { "3ER_AM": 38.20, "2DO_AM": 41.20, "1ER_AM": 44.20 },
  73: { "3ER_AM": 38.40, "2DO_AM": 41.40, "1ER_AM": 44.40 },
  72: { "3ER_AM": 38.60, "2DO_AM": 41.60, "1ER_AM": 44.60 },
  71: { "3ER_AM": 38.80, "2DO_AM": 41.80, "1ER_AM": 44.80 },
  70: { "3ER_AM": 39.00, "2DO_AM": 42.00, "1ER_AM": 45.00 },
  69: { "3ER_AM": 39.20, "2DO_AM": 42.20, "1ER_AM": 45.20 },
  68: { "3ER_AM": 39.40, "2DO_AM": 42.40, "1ER_AM": 45.40 },
  67: { "3ER_AM": 39.60, "2DO_AM": 42.60, "1ER_AM": 45.60 },
  66: { "3ER_AM": 39.80, "2DO_AM": 42.80, "1ER_AM": 45.80 },
  65: { "3ER_AM": 40.00, "2DO_AM": 43.00, "1ER_AM": 46.00 },
  64: { "3ER_AM": 40.20, "2DO_AM": 43.20, "1ER_AM": 46.20 },
  63: { "3ER_AM": 40.40, "2DO_AM": 43.40, "1ER_AM": 46.40 },
  62: { "3ER_AM": 40.60, "2DO_AM": 43.60, "1ER_AM": 46.60 },
  61: { "3ER_AM": 40.80, "2DO_AM": 43.80, "1ER_AM": 46.80 },
  60: { "3ER_AM": 41.00, "2DO_AM": 44.00, "1ER_AM": 47.00 },
  59: { "3ER_AM": 41.20, "2DO_AM": 44.20, "1ER_AM": 47.20 },
  58: { "3ER_AM": 41.40, "2DO_AM": 44.40, "1ER_AM": 47.40 },
  57: { "3ER_AM": 41.60, "2DO_AM": 44.60, "1ER_AM": 47.60 },
  56: { "3ER_AM": 41.80, "2DO_AM": 44.80, "1ER_AM": 47.80 },
  55: { "3ER_AM": 42.00, "2DO_AM": 45.00, "1ER_AM": 48.00 },
  54: { "3ER_AM": 42.20, "2DO_AM": 45.20, "1ER_AM": 48.20 },
  53: { "3ER_AM": 42.40, "2DO_AM": 45.40, "1ER_AM": 48.40 },
  52: { "3ER_AM": 42.60, "2DO_AM": 45.60, "1ER_AM": 48.60 },
  51: { "3ER_AM": 42.80, "2DO_AM": 45.80, "1ER_AM": 48.80 },
  50: { "3ER_AM": 43.00, "2DO_AM": 46.00, "1ER_AM": 49.00 },
  49: { "3ER_AM": 43.20, "2DO_AM": 46.20, "1ER_AM": 49.20 },
  48: { "3ER_AM": 43.40, "2DO_AM": 46.40, "1ER_AM": 49.40 },
  47: { "3ER_AM": 43.60, "2DO_AM": 46.60, "1ER_AM": 49.60 },
  46: { "3ER_AM": 43.80, "2DO_AM": 46.80, "1ER_AM": 49.80 },
  45: { "3ER_AM": 44.00, "2DO_AM": 47.00, "1ER_AM": 50.00 },
  44: { "3ER_AM": 44.20, "2DO_AM": 47.20, "1ER_AM": 50.20 },
  43: { "3ER_AM": 44.40, "2DO_AM": 47.40, "1ER_AM": 50.40 },
  42: { "3ER_AM": 44.60, "2DO_AM": 47.60, "1ER_AM": 50.60 },
  41: { "3ER_AM": 44.80, "2DO_AM": 47.80, "1ER_AM": 50.80 },
  40: { "3ER_AM": 45.00, "2DO_AM": 48.00, "1ER_AM": 51.00 },
  39: { "3ER_AM": 45.20, "2DO_AM": 48.20, "1ER_AM": 51.20 },
  38: { "3ER_AM": 45.40, "2DO_AM": 48.40, "1ER_AM": 51.40 },
  37: { "3ER_AM": 45.60, "2DO_AM": 48.60, "1ER_AM": 51.60 },
  36: { "3ER_AM": 45.80, "2DO_AM": 48.80, "1ER_AM": 51.80 },
  35: { "3ER_AM": 46.00, "2DO_AM": 49.00, "1ER_AM": 52.00 },
  34: { "3ER_AM": 46.20, "2DO_AM": 49.20, "1ER_AM": 52.20 },
  33: { "3ER_AM": 46.40, "2DO_AM": 49.40, "1ER_AM": 52.40 },
  32: { "3ER_AM": 46.60, "2DO_AM": 49.60, "1ER_AM": 52.60 },
  31: { "3ER_AM": 46.80, "2DO_AM": 49.80, "1ER_AM": 52.80 },
  30: { "3ER_AM": 47.00, "2DO_AM": 50.00, "1ER_AM": 53.00 },
  29: { "3ER_AM": 47.20, "2DO_AM": 50.20, "1ER_AM": 53.20 },
  28: { "3ER_AM": 47.40, "2DO_AM": 50.40, "1ER_AM": 53.40 },
  27: { "3ER_AM": 47.60, "2DO_AM": 50.60, "1ER_AM": 53.60 },
  26: { "3ER_AM": 47.80, "2DO_AM": 50.80, "1ER_AM": 53.80 },
  25: { "3ER_AM": 48.00, "2DO_AM": 51.00, "1ER_AM": 54.00 },
  24: { "3ER_AM": 48.20, "2DO_AM": 51.20, "1ER_AM": 54.20 },
  23: { "3ER_AM": 48.40, "2DO_AM": 51.40, "1ER_AM": 54.40 },
  22: { "3ER_AM": 48.60, "2DO_AM": 51.60, "1ER_AM": 54.60 },
  21: { "3ER_AM": 48.80, "2DO_AM": 51.80, "1ER_AM": 54.80 },
  20: { "3ER_AM": 49.00, "2DO_AM": 52.00, "1ER_AM": 55.00 },
  19: { "3ER_AM": 49.20, "2DO_AM": 52.20, "1ER_AM": 55.20 },
  18: { "3ER_AM": 49.40, "2DO_AM": 52.40, "1ER_AM": 55.40 },
  17: { "3ER_AM": 49.60, "2DO_AM": 52.60, "1ER_AM": 55.60 },
  16: { "3ER_AM": 49.80, "2DO_AM": 52.80, "1ER_AM": 55.80 },
  15: { "3ER_AM": 50.00, "2DO_AM": 53.00, "1ER_AM": 56.00 },
  14: { "3ER_AM": 50.20, "2DO_AM": 53.20, "1ER_AM": 56.20 },
  13: { "3ER_AM": 50.40, "2DO_AM": 53.40, "1ER_AM": 56.40 },
  12: { "3ER_AM": 50.60, "2DO_AM": 53.60, "1ER_AM": 56.60 },
  11: { "3ER_AM": 50.80, "2DO_AM": 53.80, "1ER_AM": 56.80 },
  10: { "3ER_AM": 51.00, "2DO_AM": 54.00, "1ER_AM": 57.00 },
  9: { "3ER_AM": 51.20, "2DO_AM": 54.20, "1ER_AM": 57.20 },
  8: { "3ER_AM": 51.40, "2DO_AM": 54.40, "1ER_AM": 57.40 },
  7: { "3ER_AM": 51.60, "2DO_AM": 54.60, "1ER_AM": 57.60 },
  6: { "3ER_AM": 51.80, "2DO_AM": 54.80, "1ER_AM": 57.80 },
  5: { "3ER_AM": 52.00, "2DO_AM": 55.00, "1ER_AM": 58.00 },
  4: { "3ER_AM": 52.20, "2DO_AM": 55.20, "1ER_AM": 58.20 },
  3: { "3ER_AM": 52.40, "2DO_AM": 55.40, "1ER_AM": 58.40 },
  2: { "3ER_AM": 52.60, "2DO_AM": 55.60, "1ER_AM": 58.60 },
  1: { "3ER_AM": 52.80, "2DO_AM": 55.80, "1ER_AM": 58.80 },
  0: { "3ER_AM": 53.00, "2DO_AM": 56.00, "1ER_AM": 59.00 },
};

tablaJardin: TablaFlexiones = {
  100.00: { "3ER_AM": 3.45, "2DO_AM": 4.00, "1ER_AM": 4.15 },
  99.30: { "3ER_AM": 3.46, "2DO_AM": 4.01, "1ER_AM": 4.16 },
  98.70: { "3ER_AM": 3.47, "2DO_AM": 4.02, "1ER_AM": 4.17 },
  98.10: { "3ER_AM": 3.48, "2DO_AM": 4.03, "1ER_AM": 4.18 },
  97.50: { "3ER_AM": 3.49, "2DO_AM": 4.04, "1ER_AM": 4.19 },
  96.90: { "3ER_AM": 3.50, "2DO_AM": 4.05, "1ER_AM": 4.20 },
  96.30: { "3ER_AM": 3.51, "2DO_AM": 4.06, "1ER_AM": 4.21 },
  95.70: { "3ER_AM": 3.52, "2DO_AM": 4.07, "1ER_AM": 4.22 },
  95.10: { "3ER_AM": 3.53, "2DO_AM": 4.08, "1ER_AM": 4.23 },
  94.50: { "3ER_AM": 3.54, "2DO_AM": 4.09, "1ER_AM": 4.24 },
  93.90: { "3ER_AM": 3.55, "2DO_AM": 4.10, "1ER_AM": 4.25 },
  93.30: { "3ER_AM": 3.56, "2DO_AM": 4.11, "1ER_AM": 4.26 },
  92.70: { "3ER_AM": 3.57, "2DO_AM": 4.12, "1ER_AM": 4.27 },
  92.10: { "3ER_AM": 3.58, "2DO_AM": 4.13, "1ER_AM": 4.28 },
  91.50: { "3ER_AM": 3.59, "2DO_AM": 4.14, "1ER_AM": 4.29 },
  90.90: { "3ER_AM": 4.00, "2DO_AM": 4.15, "1ER_AM": 4.30 },
  90.30: { "3ER_AM": 4.01, "2DO_AM": 4.16, "1ER_AM": 4.31 },
  89.70: { "3ER_AM": 4.02, "2DO_AM": 4.17, "1ER_AM": 4.32 },
  89.10: { "3ER_AM": 4.03, "2DO_AM": 4.18, "1ER_AM": 4.33 },
  88.50: { "3ER_AM": 4.04, "2DO_AM": 4.19, "1ER_AM": 4.34 },
  87.90: { "3ER_AM": 4.05, "2DO_AM": 4.20, "1ER_AM": 4.35 },
  87.30: { "3ER_AM": 4.06, "2DO_AM": 4.21, "1ER_AM": 4.36 },
  86.70: { "3ER_AM": 4.07, "2DO_AM": 4.22, "1ER_AM": 4.37 },
  86.10: { "3ER_AM": 4.08, "2DO_AM": 4.23, "1ER_AM": 4.38 },
  85.50: { "3ER_AM": 4.09, "2DO_AM": 4.24, "1ER_AM": 4.39 },
  84.90: { "3ER_AM": 4.10, "2DO_AM": 4.25, "1ER_AM": 4.40 },
  84.30: { "3ER_AM": 4.11, "2DO_AM": 4.26, "1ER_AM": 4.41 },
  83.70: { "3ER_AM": 4.12, "2DO_AM": 4.27, "1ER_AM": 4.42 },
  83.10: { "3ER_AM": 4.13, "2DO_AM": 4.28, "1ER_AM": 4.43 },
  82.50: { "3ER_AM": 4.14, "2DO_AM": 4.29, "1ER_AM": 4.44 },
  81.90: { "3ER_AM": 4.15, "2DO_AM": 4.30, "1ER_AM": 4.45 },
  81.30: { "3ER_AM": 4.16, "2DO_AM": 4.31, "1ER_AM": 4.46 },
  80.70: { "3ER_AM": 4.17, "2DO_AM": 4.32, "1ER_AM": 4.47 },
  80.10: { "3ER_AM": 4.18, "2DO_AM": 4.33, "1ER_AM": 4.48 },
  79.50: { "3ER_AM": 4.19, "2DO_AM": 4.34, "1ER_AM": 4.49 },
  78.90: { "3ER_AM": 4.20, "2DO_AM": 4.35, "1ER_AM": 4.50 },
  78.30: { "3ER_AM": 4.21, "2DO_AM": 4.36, "1ER_AM": 4.51 },
  77.70: { "3ER_AM": 4.22, "2DO_AM": 4.37, "1ER_AM": 4.52 },
  77.10: { "3ER_AM": 4.23, "2DO_AM": 4.38, "1ER_AM": 4.53 },
  76.50: { "3ER_AM": 4.24, "2DO_AM": 4.39, "1ER_AM": 4.54 },
  75.90: { "3ER_AM": 4.25, "2DO_AM": 4.40, "1ER_AM": 4.55 },
  75.30: { "3ER_AM": 4.26, "2DO_AM": 4.41, "1ER_AM": 4.56 },
  74.70: { "3ER_AM": 4.27, "2DO_AM": 4.42, "1ER_AM": 4.57 },
  74.10: { "3ER_AM": 4.28, "2DO_AM": 4.43, "1ER_AM": 4.58 },
  73.50: { "3ER_AM": 4.29, "2DO_AM": 4.44, "1ER_AM": 4.59 },
  72.90: { "3ER_AM": 4.30, "2DO_AM": 4.45, "1ER_AM": 5.00 },
  72.30: { "3ER_AM": 4.31, "2DO_AM": 4.46, "1ER_AM": 5.01 },
  71.70: { "3ER_AM": 4.32, "2DO_AM": 4.47, "1ER_AM": 5.02 },
  71.10: { "3ER_AM": 4.33, "2DO_AM": 4.48, "1ER_AM": 5.03 },
  70.50: { "3ER_AM": 4.34, "2DO_AM": 4.49, "1ER_AM": 5.04 },
  69.90: { "3ER_AM": 4.35, "2DO_AM": 4.50, "1ER_AM": 5.05 },
  69.30: { "3ER_AM": 4.36, "2DO_AM": 4.51, "1ER_AM": 5.06 },
  68.70: { "3ER_AM": 4.37, "2DO_AM": 4.52, "1ER_AM": 5.07 },
  68.10: { "3ER_AM": 4.38, "2DO_AM": 4.53, "1ER_AM": 5.08 },
  67.50: { "3ER_AM": 4.39, "2DO_AM": 4.54, "1ER_AM": 5.09 },
  66.90: { "3ER_AM": 4.40, "2DO_AM": 4.55, "1ER_AM": 5.10 },
  66.30: { "3ER_AM": 4.41, "2DO_AM": 4.56, "1ER_AM": 5.11 },
  65.70: { "3ER_AM": 4.42, "2DO_AM": 4.57, "1ER_AM": 5.12 },
  65.10: { "3ER_AM": 4.43, "2DO_AM": 4.58, "1ER_AM": 5.13 },
  64.50: { "3ER_AM": 4.44, "2DO_AM": 4.59, "1ER_AM": 5.14 },
  63.90: { "3ER_AM": 4.45, "2DO_AM": 5.00, "1ER_AM": 5.15 },
  63.30: { "3ER_AM": 4.46, "2DO_AM": 5.01, "1ER_AM": 5.16 },
  62.70: { "3ER_AM": 4.47, "2DO_AM": 5.02, "1ER_AM": 5.17 },
  62.10: { "3ER_AM": 4.48, "2DO_AM": 5.03, "1ER_AM": 5.18 },
  61.50: { "3ER_AM": 4.49, "2DO_AM": 5.04, "1ER_AM": 5.19 },
  60.90: { "3ER_AM": 4.50, "2DO_AM": 5.05, "1ER_AM": 5.20 },
  60.30: { "3ER_AM": 4.51, "2DO_AM": 5.06, "1ER_AM": 5.21 },
  59.70: { "3ER_AM": 4.52, "2DO_AM": 5.07, "1ER_AM": 5.22 },
  59.10: { "3ER_AM": 4.53, "2DO_AM": 5.08, "1ER_AM": 5.23 },
  58.50: { "3ER_AM": 4.54, "2DO_AM": 5.09, "1ER_AM": 5.24 },
  57.90: { "3ER_AM": 4.55, "2DO_AM": 5.10, "1ER_AM": 5.25 },
  57.30: { "3ER_AM": 4.56, "2DO_AM": 5.11, "1ER_AM": 5.26 },
  56.70: { "3ER_AM": 4.57, "2DO_AM": 5.12, "1ER_AM": 5.27 },
  56.10: { "3ER_AM": 4.58, "2DO_AM": 5.13, "1ER_AM": 5.28 },
  55.50: { "3ER_AM": 4.59, "2DO_AM": 5.14, "1ER_AM": 5.29 },
  54.90: { "3ER_AM": 5.00, "2DO_AM": 5.15, "1ER_AM": 5.30 },
  54.30: { "3ER_AM": 5.01, "2DO_AM": 5.16, "1ER_AM": 5.31 },
  53.70: { "3ER_AM": 5.02, "2DO_AM": 5.17, "1ER_AM": 5.32 },
  53.10: { "3ER_AM": 5.03, "2DO_AM": 5.18, "1ER_AM": 5.33 },
  52.50: { "3ER_AM": 5.04, "2DO_AM": 5.19, "1ER_AM": 5.34 },
  51.90: { "3ER_AM": 5.05, "2DO_AM": 5.20, "1ER_AM": 5.35 },
  51.30: { "3ER_AM": 5.06, "2DO_AM": 5.21, "1ER_AM": 5.36 },
  50.70: { "3ER_AM": 5.07, "2DO_AM": 5.22, "1ER_AM": 5.37 },
  50.10: { "3ER_AM": 5.08, "2DO_AM": 5.23, "1ER_AM": 5.38 },
  49.50: { "3ER_AM": 5.09, "2DO_AM": 5.24, "1ER_AM": 5.39 },
  48.90: { "3ER_AM": 5.10, "2DO_AM": 5.25, "1ER_AM": 5.40 },
  48.30: { "3ER_AM": 5.11, "2DO_AM": 5.26, "1ER_AM": 5.41 },
  47.70: { "3ER_AM": 5.12, "2DO_AM": 5.27, "1ER_AM": 5.42 },
  47.10: { "3ER_AM": 5.13, "2DO_AM": 5.28, "1ER_AM": 5.43 },
  46.50: { "3ER_AM": 5.14, "2DO_AM": 5.29, "1ER_AM": 5.44 },
  45.90: { "3ER_AM": 5.15, "2DO_AM": 5.30, "1ER_AM": 5.45 },
  45.30: { "3ER_AM": 5.16, "2DO_AM": 5.31, "1ER_AM": 5.46 },
  44.70: { "3ER_AM": 5.17, "2DO_AM": 5.32, "1ER_AM": 5.47 },
  44.10: { "3ER_AM": 5.18, "2DO_AM": 5.33, "1ER_AM": 5.48 },
  43.50: { "3ER_AM": 5.19, "2DO_AM": 5.34, "1ER_AM": 5.49 },
  42.90: { "3ER_AM": 5.20, "2DO_AM": 5.35, "1ER_AM": 5.50 },
  42.30: { "3ER_AM": 5.21, "2DO_AM": 5.36, "1ER_AM": 5.51 },
  41.70: { "3ER_AM": 5.22, "2DO_AM": 5.37, "1ER_AM": 5.52 },
  41.10: { "3ER_AM": 5.23, "2DO_AM": 5.38, "1ER_AM": 5.53 },
  40.50: { "3ER_AM": 5.24, "2DO_AM": 5.39, "1ER_AM": 5.54 },
  39.90: { "3ER_AM": 5.25, "2DO_AM": 5.40, "1ER_AM": 5.55 },
  39.30: { "3ER_AM": 5.26, "2DO_AM": 5.41, "1ER_AM": 5.56 },
  38.70: { "3ER_AM": 5.27, "2DO_AM": 5.42, "1ER_AM": 5.57 },
  38.10: { "3ER_AM": 5.28, "2DO_AM": 5.43, "1ER_AM": 5.58 },
  37.50: { "3ER_AM": 5.29, "2DO_AM": 5.44, "1ER_AM": 5.59 },
  36.90: { "3ER_AM": 5.30, "2DO_AM": 5.45, "1ER_AM": 6.00 },
  36.30: { "3ER_AM": 5.31, "2DO_AM": 5.46, "1ER_AM": 6.01 },
  35.70: { "3ER_AM": 5.32, "2DO_AM": 5.47, "1ER_AM": 6.02 },
  35.10: { "3ER_AM": 5.33, "2DO_AM": 5.48, "1ER_AM": 6.03 },
  34.50: { "3ER_AM": 5.34, "2DO_AM": 5.49, "1ER_AM": 6.04 },
  33.90: { "3ER_AM": 5.35, "2DO_AM": 5.50, "1ER_AM": 6.05 },
  33.30: { "3ER_AM": 5.36, "2DO_AM": 5.51, "1ER_AM": 6.06 },
  32.70: { "3ER_AM": 5.37, "2DO_AM": 5.52, "1ER_AM": 6.07 },
  32.10: { "3ER_AM": 5.38, "2DO_AM": 5.53, "1ER_AM": 6.08 },
  31.50: { "3ER_AM": 5.39, "2DO_AM": 5.54, "1ER_AM": 6.09 },
  30.90: { "3ER_AM": 5.40, "2DO_AM": 5.55, "1ER_AM": 6.10 },
  30.30: { "3ER_AM": 5.41, "2DO_AM": 5.56, "1ER_AM": 6.11 },
  29.70: { "3ER_AM": 5.42, "2DO_AM": 5.57, "1ER_AM": 6.12 },
  29.10: { "3ER_AM": 5.43, "2DO_AM": 5.58, "1ER_AM": 6.13 },
  28.50: { "3ER_AM": 5.44, "2DO_AM": 5.59, "1ER_AM": 6.14 },
  27.90: { "3ER_AM": 5.45, "2DO_AM": 6.00, "1ER_AM": 6.15 },
  27.30: { "3ER_AM": 5.46, "2DO_AM": 6.01, "1ER_AM": 6.16 },
  26.70: { "3ER_AM": 5.47, "2DO_AM": 6.02, "1ER_AM": 6.17 },
  26.10: { "3ER_AM": 5.48, "2DO_AM": 6.03, "1ER_AM": 6.18 },
  25.50: { "3ER_AM": 5.49, "2DO_AM": 6.04, "1ER_AM": 6.19 },
  24.90: { "3ER_AM": 5.50, "2DO_AM": 6.05, "1ER_AM": 6.20 },
  24.30: { "3ER_AM": 5.51, "2DO_AM": 6.06, "1ER_AM": 6.21 },
  23.70: { "3ER_AM": 5.52, "2DO_AM": 6.07, "1ER_AM": 6.22 },
  23.10: { "3ER_AM": 5.53, "2DO_AM": 6.08, "1ER_AM": 6.23 },
  22.50: { "3ER_AM": 5.54, "2DO_AM": 6.09, "1ER_AM": 6.24 },
  21.90: { "3ER_AM": 5.55, "2DO_AM": 6.10, "1ER_AM": 6.25 },
  21.30: { "3ER_AM": 5.56, "2DO_AM": 6.11, "1ER_AM": 6.26 },
  20.70: { "3ER_AM": 5.57, "2DO_AM": 6.12, "1ER_AM": 6.27 },
  20.10: { "3ER_AM": 5.58, "2DO_AM": 6.13, "1ER_AM": 6.28 },
  19.50: { "3ER_AM": 5.59, "2DO_AM": 6.14, "1ER_AM": 6.29 },
  18.90: { "3ER_AM": 6.00, "2DO_AM": 6.15, "1ER_AM": 6.30 },
  18.30: { "3ER_AM": 6.01, "2DO_AM": 6.16, "1ER_AM": 6.31 },
  17.70: { "3ER_AM": 6.02, "2DO_AM": 6.17, "1ER_AM": 6.32 },
  17.10: { "3ER_AM": 6.03, "2DO_AM": 6.18, "1ER_AM": 6.33 },
  16.50: { "3ER_AM": 6.04, "2DO_AM": 6.19, "1ER_AM": 6.34 },
  15.90: { "3ER_AM": 6.05, "2DO_AM": 6.20, "1ER_AM": 6.35 },
  15.30: { "3ER_AM": 6.06, "2DO_AM": 6.21, "1ER_AM": 6.36 },
  14.70: { "3ER_AM": 6.07, "2DO_AM": 6.22, "1ER_AM": 6.37 },
  14.10: { "3ER_AM": 6.08, "2DO_AM": 6.23, "1ER_AM": 6.38 },
  13.50: { "3ER_AM": 6.09, "2DO_AM": 6.24, "1ER_AM": 6.39 },
  12.90: { "3ER_AM": 6.10, "2DO_AM": 6.25, "1ER_AM": 6.40 },
  12.30: { "3ER_AM": 6.11, "2DO_AM": 6.26, "1ER_AM": 6.41 },
  11.70: { "3ER_AM": 6.12, "2DO_AM": 6.27, "1ER_AM": 6.42 },
  11.10: { "3ER_AM": 6.13, "2DO_AM": 6.28, "1ER_AM": 6.43 },
  10.50: { "3ER_AM": 6.14, "2DO_AM": 6.29, "1ER_AM": 6.44 },
  9.90: { "3ER_AM": 6.15, "2DO_AM": 6.30, "1ER_AM": 6.45 },
  9.30: { "3ER_AM": 6.16, "2DO_AM": 6.31, "1ER_AM": 6.46 },
  8.70: { "3ER_AM": 6.17, "2DO_AM": 6.32, "1ER_AM": 6.47 },
  8.10: { "3ER_AM": 6.18, "2DO_AM": 6.33, "1ER_AM": 6.48 },
  7.50: { "3ER_AM": 6.19, "2DO_AM": 6.34, "1ER_AM": 6.49 },
  6.90: { "3ER_AM": 6.20, "2DO_AM": 6.35, "1ER_AM": 6.50 },
  6.30: { "3ER_AM": 6.21, "2DO_AM": 6.36, "1ER_AM": 6.51 },
  5.70: { "3ER_AM": 6.22, "2DO_AM": 6.37, "1ER_AM": 6.52 },
  5.10: { "3ER_AM": 6.23, "2DO_AM": 6.38, "1ER_AM": 6.53 },
  4.50: { "3ER_AM": 6.24, "2DO_AM": 6.39, "1ER_AM": 6.54 },
  3.90: { "3ER_AM": 6.25, "2DO_AM": 6.40, "1ER_AM": 6.55 },
  3.30: { "3ER_AM": 6.26, "2DO_AM": 6.41, "1ER_AM": 6.56 },
  2.70: { "3ER_AM": 6.27, "2DO_AM": 6.42, "1ER_AM": 6.57 },
  2.10: { "3ER_AM": 6.28, "2DO_AM": 6.43, "1ER_AM": 6.58 },
  1.50: { "3ER_AM": 6.29, "2DO_AM": 6.44, "1ER_AM": 6.59 },
  0.90: { "3ER_AM": 6.30, "2DO_AM": 6.45, "1ER_AM": 7.00 },
  0.30: { "3ER_AM": 6.31, "2DO_AM": 6.46, "1ER_AM": 7.01 },
  0.00: { "3ER_AM": 6.32, "2DO_AM": 6.47, "1ER_AM": 7.02 },
};

tablaAeroM: TablaFlexiones = {
  100: { "3ER_AM": 12.42, "2DO_AM": 12.54, "1ER_AM": 13.06 },
  99:  { "3ER_AM": 12.45, "2DO_AM": 12.57, "1ER_AM": 13.09 },
  98:  { "3ER_AM": 12.48, "2DO_AM": 13.00, "1ER_AM": 13.12 },
  97:  { "3ER_AM": 12.51, "2DO_AM": 13.03, "1ER_AM": 13.15 },
  96:  { "3ER_AM": 12.54, "2DO_AM": 13.06, "1ER_AM": 13.18 },
  95:  { "3ER_AM": 12.57, "2DO_AM": 13.09, "1ER_AM": 13.21 },
  94:  { "3ER_AM": 13.00, "2DO_AM": 13.12, "1ER_AM": 13.24 },
  93:  { "3ER_AM": 13.03, "2DO_AM": 13.15, "1ER_AM": 13.27 },
  92:  { "3ER_AM": 13.06, "2DO_AM": 13.18, "1ER_AM": 13.30 },
  91:  { "3ER_AM": 13.09, "2DO_AM": 13.21, "1ER_AM": 13.33 },
  90:  { "3ER_AM": 13.12, "2DO_AM": 13.24, "1ER_AM": 13.36 },
  89:  { "3ER_AM": 13.15, "2DO_AM": 13.27, "1ER_AM": 13.39 },
  88:  { "3ER_AM": 13.18, "2DO_AM": 13.30, "1ER_AM": 13.42 },
  87:  { "3ER_AM": 13.21, "2DO_AM": 13.33, "1ER_AM": 13.45 },
  86:  { "3ER_AM": 13.24, "2DO_AM": 13.36, "1ER_AM": 13.48 },
  85:  { "3ER_AM": 13.27, "2DO_AM": 13.39, "1ER_AM": 13.51 },
  84:  { "3ER_AM": 13.30, "2DO_AM": 13.42, "1ER_AM": 13.54 },
  83:  { "3ER_AM": 13.33, "2DO_AM": 13.45, "1ER_AM": 13.57 },
  82:  { "3ER_AM": 13.36, "2DO_AM": 13.48, "1ER_AM": 14.00 },
  81:  { "3ER_AM": 13.39, "2DO_AM": 13.51, "1ER_AM": 14.03 },
  80:  { "3ER_AM": 13.42, "2DO_AM": 13.54, "1ER_AM": 14.06 },
  79:  { "3ER_AM": 13.45, "2DO_AM": 13.57, "1ER_AM": 14.09 },
  78:  { "3ER_AM": 13.48, "2DO_AM": 14.00, "1ER_AM": 14.12 },
  77:  { "3ER_AM": 13.51, "2DO_AM": 14.03, "1ER_AM": 14.15 },
  76:  { "3ER_AM": 13.54, "2DO_AM": 14.06, "1ER_AM": 14.18 },
  75:  { "3ER_AM": 13.57, "2DO_AM": 14.09, "1ER_AM": 14.21 },
  74:  { "3ER_AM": 14.00, "2DO_AM": 14.12, "1ER_AM": 14.24 },
  73:  { "3ER_AM": 14.03, "2DO_AM": 14.15, "1ER_AM": 14.27 },
  72:  { "3ER_AM": 14.06, "2DO_AM": 14.18, "1ER_AM": 14.30 },
  71:  { "3ER_AM": 14.09, "2DO_AM": 14.21, "1ER_AM": 14.33 },
  70:  { "3ER_AM": 14.12, "2DO_AM": 14.24, "1ER_AM": 14.36 },
  69:  { "3ER_AM": 14.15, "2DO_AM": 14.27, "1ER_AM": 14.39 },
  68:  { "3ER_AM": 14.18, "2DO_AM": 14.30, "1ER_AM": 14.42 },
  67:  { "3ER_AM": 14.21, "2DO_AM": 14.33, "1ER_AM": 14.45 },
  66:  { "3ER_AM": 14.24, "2DO_AM": 14.36, "1ER_AM": 14.48 },
  65:  { "3ER_AM": 14.27, "2DO_AM": 14.39, "1ER_AM": 14.51 },
  64:  { "3ER_AM": 14.30, "2DO_AM": 14.42, "1ER_AM": 14.54 },
  63:  { "3ER_AM": 14.33, "2DO_AM": 14.45, "1ER_AM": 14.57 },
  62:  { "3ER_AM": 14.36, "2DO_AM": 14.48, "1ER_AM": 15.00 },
  61:  { "3ER_AM": 14.39, "2DO_AM": 14.51, "1ER_AM": 15.03 },
  60:  { "3ER_AM": 14.42, "2DO_AM": 14.54, "1ER_AM": 15.06 },
  59:  { "3ER_AM": 14.45, "2DO_AM": 14.57, "1ER_AM": 15.09 },
  58:  { "3ER_AM": 14.48, "2DO_AM": 15.00, "1ER_AM": 15.12 },
  57:  { "3ER_AM": 14.51, "2DO_AM": 15.03, "1ER_AM": 15.15 },
  56:  { "3ER_AM": 14.54, "2DO_AM": 15.06, "1ER_AM": 15.18 },
  55:  { "3ER_AM": 14.57, "2DO_AM": 15.09, "1ER_AM": 15.21 },
  54:  { "3ER_AM": 15.00, "2DO_AM": 15.12, "1ER_AM": 15.24 },
  53:  { "3ER_AM": 15.03, "2DO_AM": 15.15, "1ER_AM": 15.27 },
  52:  { "3ER_AM": 15.06, "2DO_AM": 15.18, "1ER_AM": 15.30 },
  51:  { "3ER_AM": 15.09, "2DO_AM": 15.21, "1ER_AM": 15.33 },
  50:  { "3ER_AM": 15.12, "2DO_AM": 15.24, "1ER_AM": 15.36 },
  49:  { "3ER_AM": 15.15, "2DO_AM": 15.27, "1ER_AM": 15.39 },
  48:  { "3ER_AM": 15.18, "2DO_AM": 15.30, "1ER_AM": 15.42 },
  47:  { "3ER_AM": 15.21, "2DO_AM": 15.33, "1ER_AM": 15.45 },
  46:  { "3ER_AM": 15.24, "2DO_AM": 15.36, "1ER_AM": 15.48 },
  45:  { "3ER_AM": 15.27, "2DO_AM": 15.39, "1ER_AM": 15.51 },
  44:  { "3ER_AM": 15.30, "2DO_AM": 15.42, "1ER_AM": 15.54 },
  43:  { "3ER_AM": 15.33, "2DO_AM": 15.45, "1ER_AM": 15.57 },
  42:  { "3ER_AM": 15.36, "2DO_AM": 15.48, "1ER_AM": 16.00 },
  41:  { "3ER_AM": 15.39, "2DO_AM": 15.51, "1ER_AM": 16.03 },
  40:  { "3ER_AM": 15.42, "2DO_AM": 15.54, "1ER_AM": 16.06 },
  39:  { "3ER_AM": 15.45, "2DO_AM": 15.57, "1ER_AM": 16.09 },
  38:  { "3ER_AM": 15.48, "2DO_AM": 16.00, "1ER_AM": 16.12 },
  37:  { "3ER_AM": 15.51, "2DO_AM": 16.03, "1ER_AM": 16.15 },
  36:  { "3ER_AM": 15.54, "2DO_AM": 16.06, "1ER_AM": 16.18 },
  35:  { "3ER_AM": 15.57, "2DO_AM": 16.09, "1ER_AM": 16.21 },
  34:  { "3ER_AM": 16.00, "2DO_AM": 16.12, "1ER_AM": 16.24 },
  33:  { "3ER_AM": 16.03, "2DO_AM": 16.15, "1ER_AM": 16.27 },
  32:  { "3ER_AM": 16.06, "2DO_AM": 16.18, "1ER_AM": 16.30 },
  31:  { "3ER_AM": 16.09, "2DO_AM": 16.21, "1ER_AM": 16.33 },
  30:  { "3ER_AM": 16.12, "2DO_AM": 16.24, "1ER_AM": 16.36 },
  29:  { "3ER_AM": 16.15, "2DO_AM": 16.27, "1ER_AM": 16.39 },
  28:  { "3ER_AM": 16.18, "2DO_AM": 16.30, "1ER_AM": 16.42 },
  27:  { "3ER_AM": 16.21, "2DO_AM": 16.33, "1ER_AM": 16.45 },
  26:  { "3ER_AM": 16.24, "2DO_AM": 16.36, "1ER_AM": 16.48 },
  25:  { "3ER_AM": 16.27, "2DO_AM": 16.39, "1ER_AM": 16.51 },
  24:  { "3ER_AM": 16.30, "2DO_AM": 16.42, "1ER_AM": 16.54 },
  23:  { "3ER_AM": 16.33, "2DO_AM": 16.45, "1ER_AM": 16.57 },
  22:  { "3ER_AM": 16.36, "2DO_AM": 16.48, "1ER_AM": 17.00 },
  21:  { "3ER_AM": 16.39, "2DO_AM": 16.51, "1ER_AM": 17.03 },
  20:  { "3ER_AM": 16.42, "2DO_AM": 16.54, "1ER_AM": 17.06 },
  19:  { "3ER_AM": 16.45, "2DO_AM": 16.57, "1ER_AM": 17.09 },
  18:  { "3ER_AM": 16.48, "2DO_AM": 17.00, "1ER_AM": 17.12 },
  17:  { "3ER_AM": 16.51, "2DO_AM": 17.03, "1ER_AM": 17.15 },
  16:  { "3ER_AM": 16.54, "2DO_AM": 17.06, "1ER_AM": 17.18 },
  15:  { "3ER_AM": 16.57, "2DO_AM": 17.09, "1ER_AM": 17.21 },
  14:  { "3ER_AM": 17.00, "2DO_AM": 17.12, "1ER_AM": 17.24 },
  13:  { "3ER_AM": 17.03, "2DO_AM": 17.15, "1ER_AM": 17.27 },
  12:  { "3ER_AM": 17.06, "2DO_AM": 17.18, "1ER_AM": 17.30 },
  11:  { "3ER_AM": 17.09, "2DO_AM": 17.21, "1ER_AM": 17.33 },
  10:  { "3ER_AM": 17.12, "2DO_AM": 17.24, "1ER_AM": 17.36 },
  9:   { "3ER_AM": 17.15, "2DO_AM": 17.27, "1ER_AM": 17.39 },
  8:   { "3ER_AM": 17.18, "2DO_AM": 17.30, "1ER_AM": 17.42 },
  7:   { "3ER_AM": 17.21, "2DO_AM": 17.33, "1ER_AM": 17.45 },
  6:   { "3ER_AM": 17.24, "2DO_AM": 17.36, "1ER_AM": 17.48 },
  5:   { "3ER_AM": 17.27, "2DO_AM": 17.39, "1ER_AM": 17.51 },
  4:   { "3ER_AM": 17.30, "2DO_AM": 17.42, "1ER_AM": 17.54 },
  3:   { "3ER_AM": 17.33, "2DO_AM": 17.45, "1ER_AM": 17.57 },
  2:   { "3ER_AM": 17.36, "2DO_AM": 17.48, "1ER_AM": 18.00 },
  1:   { "3ER_AM": 17.39, "2DO_AM": 17.51, "1ER_AM": 18.03 },
  0:   { "3ER_AM": 17.42, "2DO_AM": 17.54, "1ER_AM": 18.06 }
};
tablaAeroF: TablaFlexiones = {
  100: { "3ER_AM": 15.12, "2DO_AM": 15.24, "1ER_AM": 15.36 },
  99: { "3ER_AM": 15.15, "2DO_AM": 15.27, "1ER_AM": 15.39 },
  98: { "3ER_AM": 15.18, "2DO_AM": 15.30, "1ER_AM": 15.42 },
  97: { "3ER_AM": 15.21, "2DO_AM": 15.33, "1ER_AM": 15.45 },
  96: { "3ER_AM": 15.24, "2DO_AM": 15.36, "1ER_AM": 15.48 },
  95: { "3ER_AM": 15.27, "2DO_AM": 15.39, "1ER_AM": 15.51 },
  94: { "3ER_AM": 15.30, "2DO_AM": 15.42, "1ER_AM": 15.54 },
  93: { "3ER_AM": 15.33, "2DO_AM": 15.45, "1ER_AM": 15.57 },
  92: { "3ER_AM": 15.36, "2DO_AM": 15.48, "1ER_AM": 16.00 },
  91: { "3ER_AM": 15.39, "2DO_AM": 15.51, "1ER_AM": 16.03 },
  90: { "3ER_AM": 15.42, "2DO_AM": 15.54, "1ER_AM": 16.06 },
  89: { "3ER_AM": 15.45, "2DO_AM": 15.57, "1ER_AM": 16.09 },
  88: { "3ER_AM": 15.48, "2DO_AM": 16.00, "1ER_AM": 16.12 },
  87: { "3ER_AM": 15.51, "2DO_AM": 16.03, "1ER_AM": 16.15 },
  86: { "3ER_AM": 15.54, "2DO_AM": 16.06, "1ER_AM": 16.18 },
  85: { "3ER_AM": 15.57, "2DO_AM": 16.09, "1ER_AM": 16.21 },
  84: { "3ER_AM": 16.00, "2DO_AM": 16.12, "1ER_AM": 16.24 },
  83: { "3ER_AM": 16.03, "2DO_AM": 16.15, "1ER_AM": 16.27 },
  82: { "3ER_AM": 16.06, "2DO_AM": 16.18, "1ER_AM": 16.30 },
  81: { "3ER_AM": 16.09, "2DO_AM": 16.21, "1ER_AM": 16.33 },
  80: { "3ER_AM": 16.12, "2DO_AM": 16.24, "1ER_AM": 16.36 },
  79: { "3ER_AM": 16.15, "2DO_AM": 16.27, "1ER_AM": 16.39 },
  78: { "3ER_AM": 16.18, "2DO_AM": 16.30, "1ER_AM": 16.42 },
  77: { "3ER_AM": 16.21, "2DO_AM": 16.33, "1ER_AM": 16.45 },
  76: { "3ER_AM": 16.24, "2DO_AM": 16.36, "1ER_AM": 16.48 },
  75: { "3ER_AM": 16.27, "2DO_AM": 16.39, "1ER_AM": 16.51 },
  74: { "3ER_AM": 16.30, "2DO_AM": 16.42, "1ER_AM": 16.54 },
  73: { "3ER_AM": 16.33, "2DO_AM": 16.45, "1ER_AM": 16.57 },
  72: { "3ER_AM": 16.36, "2DO_AM": 16.48, "1ER_AM": 17.00 },
  71: { "3ER_AM": 16.39, "2DO_AM": 16.51, "1ER_AM": 17.03 },
  70: { "3ER_AM": 16.42, "2DO_AM": 16.54, "1ER_AM": 17.06 },
  69: { "3ER_AM": 16.45, "2DO_AM": 16.57, "1ER_AM": 17.09 },
  68: { "3ER_AM": 16.48, "2DO_AM": 17.00, "1ER_AM": 17.12 },
  67: { "3ER_AM": 16.51, "2DO_AM": 17.03, "1ER_AM": 17.15 },
  66: { "3ER_AM": 16.54, "2DO_AM": 17.06, "1ER_AM": 17.18 },
  65: { "3ER_AM": 16.57, "2DO_AM": 17.09, "1ER_AM": 17.21 },
  64: { "3ER_AM": 17.00, "2DO_AM": 17.12, "1ER_AM": 17.24 },
  63: { "3ER_AM": 17.03, "2DO_AM": 17.15, "1ER_AM": 17.27 },
  62: { "3ER_AM": 17.06, "2DO_AM": 17.18, "1ER_AM": 17.30 },
  61: { "3ER_AM": 17.09, "2DO_AM": 17.21, "1ER_AM": 17.33 },
  60: { "3ER_AM": 17.12, "2DO_AM": 17.24, "1ER_AM": 17.36 },
  59: { "3ER_AM": 17.15, "2DO_AM": 17.27, "1ER_AM": 17.39 },
  58: { "3ER_AM": 17.18, "2DO_AM": 17.30, "1ER_AM": 17.42 },
  57: { "3ER_AM": 17.21, "2DO_AM": 17.33, "1ER_AM": 17.45 },
  56: { "3ER_AM": 17.24, "2DO_AM": 17.36, "1ER_AM": 17.48 },
  55: { "3ER_AM": 17.27, "2DO_AM": 17.39, "1ER_AM": 17.51 },
  54: { "3ER_AM": 17.30, "2DO_AM": 17.42, "1ER_AM": 17.54 },
  53: { "3ER_AM": 17.33, "2DO_AM": 17.45, "1ER_AM": 17.57 },
  52: { "3ER_AM": 17.36, "2DO_AM": 17.48, "1ER_AM": 18.00 },
  51: { "3ER_AM": 17.39, "2DO_AM": 17.51, "1ER_AM": 18.03 },
  50: { "3ER_AM": 17.42, "2DO_AM": 17.54, "1ER_AM": 18.06 },
  49: { "3ER_AM": 17.45, "2DO_AM": 17.57, "1ER_AM": 18.09 },
  48: { "3ER_AM": 17.48, "2DO_AM": 18.00, "1ER_AM": 18.12 },
  47: { "3ER_AM": 17.51, "2DO_AM": 18.03, "1ER_AM": 18.15 },
  46: { "3ER_AM": 17.54, "2DO_AM": 18.06, "1ER_AM": 18.18 },
  45: { "3ER_AM": 17.57, "2DO_AM": 18.09, "1ER_AM": 18.21 },
  44: { "3ER_AM": 18.00, "2DO_AM": 18.12, "1ER_AM": 18.24 },
  43: { "3ER_AM": 18.03, "2DO_AM": 18.15, "1ER_AM": 18.27 },
  42: { "3ER_AM": 18.06, "2DO_AM": 18.18, "1ER_AM": 18.30 },
  41: { "3ER_AM": 18.09, "2DO_AM": 18.21, "1ER_AM": 18.33 },
  40: { "3ER_AM": 18.12, "2DO_AM": 18.24, "1ER_AM": 18.36 },
  39: { "3ER_AM": 18.15, "2DO_AM": 18.27, "1ER_AM": 18.39 },
  38: { "3ER_AM": 18.18, "2DO_AM": 18.30, "1ER_AM": 18.42 },
  37: { "3ER_AM": 18.21, "2DO_AM": 18.33, "1ER_AM": 18.45 },
  36: { "3ER_AM": 18.24, "2DO_AM": 18.36, "1ER_AM": 18.48 },
  35: { "3ER_AM": 18.27, "2DO_AM": 18.39, "1ER_AM": 18.51 },
  34: { "3ER_AM": 18.30, "2DO_AM": 18.42, "1ER_AM": 18.54 },
  33: { "3ER_AM": 18.33, "2DO_AM": 18.45, "1ER_AM": 18.57 },
  32: { "3ER_AM": 18.36, "2DO_AM": 18.48, "1ER_AM": 19.00 },
  31: { "3ER_AM": 18.39, "2DO_AM": 18.51, "1ER_AM": 19.03 },
  30: { "3ER_AM": 18.42, "2DO_AM": 18.54, "1ER_AM": 19.06 },
  29: { "3ER_AM": 18.45, "2DO_AM": 18.57, "1ER_AM": 19.09 },
  28: { "3ER_AM": 18.48, "2DO_AM": 19.00, "1ER_AM": 19.12 },
  27: { "3ER_AM": 18.51, "2DO_AM": 19.03, "1ER_AM": 19.15 },
  26: { "3ER_AM": 18.54, "2DO_AM": 19.06, "1ER_AM": 19.18 },
  25: { "3ER_AM": 18.57, "2DO_AM": 19.09, "1ER_AM": 19.21 },
  24: { "3ER_AM": 19.00, "2DO_AM": 19.12, "1ER_AM": 19.24 },
  23: { "3ER_AM": 19.03, "2DO_AM": 19.15, "1ER_AM": 19.27 },
  22: { "3ER_AM": 19.06, "2DO_AM": 19.18, "1ER_AM": 19.30 },
  21: { "3ER_AM": 19.09, "2DO_AM": 19.21, "1ER_AM": 19.33 },
  20: { "3ER_AM": 19.12, "2DO_AM": 19.24, "1ER_AM": 19.36 },
  19: { "3ER_AM": 19.15, "2DO_AM": 19.27, "1ER_AM": 19.39 },
  18: { "3ER_AM": 19.18, "2DO_AM": 19.30, "1ER_AM": 19.42 },
  17: { "3ER_AM": 19.21, "2DO_AM": 19.33, "1ER_AM": 19.45 },
  16: { "3ER_AM": 19.24, "2DO_AM": 19.36, "1ER_AM": 19.48 },
  15: { "3ER_AM": 19.27, "2DO_AM": 19.39, "1ER_AM": 19.51 },
  14: { "3ER_AM": 19.30, "2DO_AM": 19.42, "1ER_AM": 19.54 },
  13: { "3ER_AM": 19.33, "2DO_AM": 19.45, "1ER_AM": 19.57 },
  12: { "3ER_AM": 19.36, "2DO_AM": 19.48, "1ER_AM": 20.00 },
  11: { "3ER_AM": 19.39, "2DO_AM": 19.51, "1ER_AM": 20.03 },
  10: { "3ER_AM": 19.42, "2DO_AM": 19.54, "1ER_AM": 20.06 },
  9: { "3ER_AM": 19.45, "2DO_AM": 19.57, "1ER_AM": 20.09 },
  8: { "3ER_AM": 19.48, "2DO_AM": 20.00, "1ER_AM": 20.12 },
  7: { "3ER_AM": 19.51, "2DO_AM": 20.03, "1ER_AM": 20.15 },
  6: { "3ER_AM": 19.54, "2DO_AM": 20.06, "1ER_AM": 20.18 },
  5: { "3ER_AM": 19.57, "2DO_AM": 20.09, "1ER_AM": 20.21 },
  4: { "3ER_AM": 20.00, "2DO_AM": 20.12, "1ER_AM": 20.24 },
  3: { "3ER_AM": 20.03, "2DO_AM": 20.15, "1ER_AM": 20.27 },
  2: { "3ER_AM": 20.06, "2DO_AM": 20.18, "1ER_AM": 20.30 },
  1: { "3ER_AM": 20.09, "2DO_AM": 20.21, "1ER_AM": 20.33 },
  0: { "3ER_AM": 20.12, "2DO_AM": 20.24, "1ER_AM": 20.36 },
};

tablaNatacion: TablaFlexiones = {
  100: { "3ER_AM": 3.55, "2DO_AM": 3.00, "1ER_AM": 2.10 },
  99:  { "3ER_AM": 3.59, "2DO_AM": 3.04, "1ER_AM": 2.14 },
  98:  { "3ER_AM": 4.03, "2DO_AM": 3.08, "1ER_AM": 2.18 },
  97:  { "3ER_AM": 4.07, "2DO_AM": 3.12, "1ER_AM": 2.22 },
  96:  { "3ER_AM": 4.11, "2DO_AM": 3.16, "1ER_AM": 2.26 },
  95:  { "3ER_AM": 4.15, "2DO_AM": 3.20, "1ER_AM": 2.30 },
  94:  { "3ER_AM": 4.19, "2DO_AM": 3.24, "1ER_AM": 2.34 },
  93:  { "3ER_AM": 4.23, "2DO_AM": 3.28, "1ER_AM": 2.38 },
  92:  { "3ER_AM": 4.27, "2DO_AM": 3.32, "1ER_AM": 2.42 },
  91:  { "3ER_AM": 4.31, "2DO_AM": 3.36, "1ER_AM": 2.46 },
  90:  { "3ER_AM": 4.35, "2DO_AM": 3.40, "1ER_AM": 2.50 },
  89:  { "3ER_AM": 4.39, "2DO_AM": 3.44, "1ER_AM": 2.54 },
  88:  { "3ER_AM": 4.43, "2DO_AM": 3.48, "1ER_AM": 2.58 },
  87:  { "3ER_AM": 4.47, "2DO_AM": 3.52, "1ER_AM": 3.02 },
  86:  { "3ER_AM": 4.51, "2DO_AM": 3.56, "1ER_AM": 3.06 },
  85:  { "3ER_AM": 4.55, "2DO_AM": 4.00, "1ER_AM": 3.10 },
  84:  { "3ER_AM": 4.59, "2DO_AM": 4.04, "1ER_AM": 3.14 },
  83:  { "3ER_AM": 5.03, "2DO_AM": 4.08, "1ER_AM": 3.18 },
  82:  { "3ER_AM": 5.07, "2DO_AM": 4.12, "1ER_AM": 3.22 },
  81:  { "3ER_AM": 5.11, "2DO_AM": 4.16, "1ER_AM": 3.26 },
  80:  { "3ER_AM": 5.15, "2DO_AM": 4.20, "1ER_AM": 3.30 },
  79:  { "3ER_AM": 5.19, "2DO_AM": 4.24, "1ER_AM": 3.34 },
  78:  { "3ER_AM": 5.23, "2DO_AM": 4.28, "1ER_AM": 3.38 },
  77:  { "3ER_AM": 5.27, "2DO_AM": 4.32, "1ER_AM": 3.42 },
  76:  { "3ER_AM": 5.31, "2DO_AM": 4.36, "1ER_AM": 3.46 },
  75:  { "3ER_AM": 5.35, "2DO_AM": 4.40, "1ER_AM": 3.50 },
  74:  { "3ER_AM": 5.39, "2DO_AM": 4.44, "1ER_AM": 3.54 },
  73:  { "3ER_AM": 5.43, "2DO_AM": 4.48, "1ER_AM": 3.58 },
  72:  { "3ER_AM": 5.47, "2DO_AM": 4.52, "1ER_AM": 4.02 },
  71:  { "3ER_AM": 5.51, "2DO_AM": 4.56, "1ER_AM": 4.06 },
  70:  { "3ER_AM": 5.55, "2DO_AM": 5.00, "1ER_AM": 4.10 },
  69:  { "3ER_AM": 5.59, "2DO_AM": 5.04, "1ER_AM": 4.14 },
  68:  { "3ER_AM": 6.03, "2DO_AM": 5.08, "1ER_AM": 4.18 },
  67:  { "3ER_AM": 6.07, "2DO_AM": 5.12, "1ER_AM": 4.22 },
  66:  { "3ER_AM": 6.11, "2DO_AM": 5.16, "1ER_AM": 4.26 },
  65:  { "3ER_AM": 6.15, "2DO_AM": 5.20, "1ER_AM": 4.30 },
  64:  { "3ER_AM": 6.19, "2DO_AM": 5.24, "1ER_AM": 4.34 },
  63:  { "3ER_AM": 6.23, "2DO_AM": 5.28, "1ER_AM": 4.38 },
  62:  { "3ER_AM": 6.27, "2DO_AM": 5.32, "1ER_AM": 4.42 },
  61:  { "3ER_AM": 6.31, "2DO_AM": 5.36, "1ER_AM": 4.46 },
  60:  { "3ER_AM": 6.35, "2DO_AM": 5.40, "1ER_AM": 4.50 },
  59:  { "3ER_AM": 6.39, "2DO_AM": 5.44, "1ER_AM": 4.54 },
  58:  { "3ER_AM": 6.43, "2DO_AM": 5.48, "1ER_AM": 4.58 },
  57:  { "3ER_AM": 6.47, "2DO_AM": 5.52, "1ER_AM": 5.02 },
  56:  { "3ER_AM": 6.51, "2DO_AM": 5.56, "1ER_AM": 5.06 },
  55:  { "3ER_AM": 6.55, "2DO_AM": 6.00, "1ER_AM": 5.10 },
  54:  { "3ER_AM": 6.59, "2DO_AM": 6.04, "1ER_AM": 5.14 },
  53:  { "3ER_AM": 7.03, "2DO_AM": 6.08, "1ER_AM": 5.18 },
  52:  { "3ER_AM": 7.07, "2DO_AM": 6.12, "1ER_AM": 5.22 },
  51:  { "3ER_AM": 7.11, "2DO_AM": 6.16, "1ER_AM": 5.26 },
  50:  { "3ER_AM": 7.15, "2DO_AM": 6.20, "1ER_AM": 5.30 },
  49:  { "3ER_AM": 7.19, "2DO_AM": 6.24, "1ER_AM": 5.34 },
  48:  { "3ER_AM": 7.23, "2DO_AM": 6.28, "1ER_AM": 5.38 },
  47:  { "3ER_AM": 7.27, "2DO_AM": 6.32, "1ER_AM": 5.42 },
  46:  { "3ER_AM": 7.31, "2DO_AM": 6.36, "1ER_AM": 5.46 },
  45:  { "3ER_AM": 7.35, "2DO_AM": 6.40, "1ER_AM": 5.50 },
  44:  { "3ER_AM": 7.39, "2DO_AM": 6.44, "1ER_AM": 5.54 },
  43:  { "3ER_AM": 7.43, "2DO_AM": 6.48, "1ER_AM": 5.58 },
  42:  { "3ER_AM": 7.47, "2DO_AM": 6.52, "1ER_AM": 6.02 },
  41:  { "3ER_AM": 7.51, "2DO_AM": 6.56, "1ER_AM": 6.06 },
  40:  { "3ER_AM": 7.55, "2DO_AM": 7.00, "1ER_AM": 6.10 },
  39:  { "3ER_AM": 7.59, "2DO_AM": 7.04, "1ER_AM": 6.14 },
  38:  { "3ER_AM": 8.03, "2DO_AM": 7.08, "1ER_AM": 6.18 },
  37:  { "3ER_AM": 8.07, "2DO_AM": 7.12, "1ER_AM": 6.22 },
  36:  { "3ER_AM": 8.11, "2DO_AM": 7.16, "1ER_AM": 6.26 },
  35:  { "3ER_AM": 8.15, "2DO_AM": 7.20, "1ER_AM": 6.30 },
  34:  { "3ER_AM": 8.19, "2DO_AM": 7.24, "1ER_AM": 6.34 },
  33:  { "3ER_AM": 8.23, "2DO_AM": 7.28, "1ER_AM": 6.38 },
  32:  { "3ER_AM": 8.27, "2DO_AM": 7.32, "1ER_AM": 6.42 },
  31:  { "3ER_AM": 8.31, "2DO_AM": 7.36, "1ER_AM": 6.46 },
  30:  { "3ER_AM": 8.35, "2DO_AM": 7.40, "1ER_AM": 6.50 },
  29:  { "3ER_AM": 8.39, "2DO_AM": 7.44, "1ER_AM": 6.54 },
  28:  { "3ER_AM": 8.43, "2DO_AM": 7.48, "1ER_AM": 6.58 },
  27:  { "3ER_AM": 8.47, "2DO_AM": 7.52, "1ER_AM": 7.02 },
  26:  { "3ER_AM": 8.51, "2DO_AM": 7.56, "1ER_AM": 7.06 },
  25:  { "3ER_AM": 8.55, "2DO_AM": 8.00, "1ER_AM": 7.10 },
  24:  { "3ER_AM": 8.59, "2DO_AM": 8.04, "1ER_AM": 7.14 },
  23:  { "3ER_AM": 9.03, "2DO_AM": 8.08, "1ER_AM": 7.18 },
  22:  { "3ER_AM": 9.07, "2DO_AM": 8.12, "1ER_AM": 7.22 },
  21:  { "3ER_AM": 9.11, "2DO_AM": 8.16, "1ER_AM": 7.26 },
  20:  { "3ER_AM": 9.15, "2DO_AM": 8.20, "1ER_AM": 7.30 },
  19:  { "3ER_AM": 9.19, "2DO_AM": 8.24, "1ER_AM": 7.34 },
  18:  { "3ER_AM": 9.23, "2DO_AM": 8.28, "1ER_AM": 7.38 },
  17:  { "3ER_AM": 9.27, "2DO_AM": 8.32, "1ER_AM": 7.42 },
  16:  { "3ER_AM": 9.31, "2DO_AM": 8.36, "1ER_AM": 7.46 },
  15:  { "3ER_AM": 9.35, "2DO_AM": 8.40, "1ER_AM": 7.50 },
  14:  { "3ER_AM": 9.39, "2DO_AM": 8.44, "1ER_AM": 7.54 },
  13:  { "3ER_AM": 9.43, "2DO_AM": 8.48, "1ER_AM": 7.58 },
  12:  { "3ER_AM": 9.47, "2DO_AM": 8.52, "1ER_AM": 8.02 },
  11:  { "3ER_AM": 9.51, "2DO_AM": 8.56, "1ER_AM": 8.06 },
  10:  { "3ER_AM": 9.55, "2DO_AM": 9.00, "1ER_AM": 8.10 },
  9:   { "3ER_AM": 9.59, "2DO_AM": 9.04, "1ER_AM": 8.14 },
  8:   { "3ER_AM": 10.03, "2DO_AM": 9.08, "1ER_AM": 8.18 },
  7:   { "3ER_AM": 10.07, "2DO_AM": 9.12, "1ER_AM": 8.22 },
  6:   { "3ER_AM": 10.11, "2DO_AM": 9.16, "1ER_AM": 8.26 },
  5:   { "3ER_AM": 10.15, "2DO_AM": 9.20, "1ER_AM": 8.30 },
  4:   { "3ER_AM": 10.19, "2DO_AM": 9.24, "1ER_AM": 8.34 },
  3:   { "3ER_AM": 10.23, "2DO_AM": 9.28, "1ER_AM": 8.38 },
  2:   { "3ER_AM": 10.27, "2DO_AM": 9.32, "1ER_AM": 8.42 },
  1:   { "3ER_AM": 10.31, "2DO_AM": 9.36, "1ER_AM": 8.46 },
  0:   { "3ER_AM": 10.35, "2DO_AM": 9.40, "1ER_AM": 8.50 }
};
tablaContexturaFisicaM: ContexturaFisica[] = [
  { alturaMin: 153, alturaMax: 155, pesoMin: 57.1, pesoMax: 66.8, puntaje: 100 },
  { alturaMin: 156, alturaMax: 158, pesoMin: 57.4, pesoMax: 71.2, puntaje: 100 },
  { alturaMin: 159, alturaMax: 161, pesoMin: 59.2, pesoMax: 72.0, puntaje: 100 },
  { alturaMin: 162, alturaMax: 164, pesoMin: 60.4, pesoMax: 74.5, puntaje: 100 },
  { alturaMin: 165, alturaMax: 167, pesoMin: 62.7, pesoMax: 77.6, puntaje: 100 },
  { alturaMin: 168, alturaMax: 170, pesoMin: 65.9, pesoMax: 80.2, puntaje: 100 },
  { alturaMin: 171, alturaMax: 173, pesoMin: 67.6, pesoMax: 83.2, puntaje: 100 },
  { alturaMin: 174, alturaMax: 176, pesoMin: 69.5, pesoMax: 85.9, puntaje: 100 },
  { alturaMin: 177, alturaMax: 179, pesoMin: 71.4, pesoMax: 87.3, puntaje: 100 },
  { alturaMin: 180, alturaMax: 182, pesoMin: 72.9, pesoMax: 90.1, puntaje: 100 },
  { alturaMin: 183, alturaMax: 185, pesoMin: 75.3, pesoMax: 93.4, puntaje: 100 },
  { alturaMin: 186, alturaMax: 188, pesoMin: 79.4, pesoMax: 95.1, puntaje: 100 },
  { alturaMin: 189, alturaMax: 191, pesoMin: 80.7, pesoMax: 99.4, puntaje: 100 },
  { alturaMin: 192, alturaMax: 195, pesoMin: 84.8, pesoMax: 105.2, puntaje: 100 },
];
tablaContexturaFisicaF: ContexturaFisica[] = [
  { alturaMin: 141, alturaMax: 143, pesoMin: 57.1, pesoMax: 66.8, puntaje: 100 },
  { alturaMin: 144, alturaMax: 146, pesoMin: 57.4, pesoMax: 71.2, puntaje: 100 },
  { alturaMin: 147, alturaMax: 149, pesoMin: 59.2, pesoMax: 72.0, puntaje: 100 },
  { alturaMin: 150, alturaMax: 152, pesoMin: 60.4, pesoMax: 74.5, puntaje: 100 },
  { alturaMin: 153, alturaMax: 155, pesoMin: 62.7, pesoMax: 77.6, puntaje: 100 },
  { alturaMin: 156, alturaMax: 158, pesoMin: 65.9, pesoMax: 80.2, puntaje: 100 },
  { alturaMin: 159, alturaMax: 161, pesoMin: 67.6, pesoMax: 83.2, puntaje: 100 },
  { alturaMin: 162, alturaMax: 164, pesoMin: 69.5, pesoMax: 85.9, puntaje: 100 },
  { alturaMin: 165, alturaMax: 167, pesoMin: 71.4, pesoMax: 87.3, puntaje: 100 },
  { alturaMin: 168, alturaMax: 170, pesoMin: 72.9, pesoMax: 90.1, puntaje: 100 },
  { alturaMin: 171, alturaMax: 173, pesoMin: 75.3, pesoMax: 93.4, puntaje: 100 },
  { alturaMin: 174, alturaMax: 176, pesoMin: 79.4, pesoMax: 95.1, puntaje: 100 },
  { alturaMin: 177, alturaMax: 179, pesoMin: 80.7, pesoMax: 99.4, puntaje: 100 },
];

  pruebasFisicas = [
    { codigo: 'EFM', nombre: 'Flexiones' },
    { codigo: 'EFM', nombre: 'Abdominales' },
    { codigo: 'EFM', nombre: 'Flexiones en barra' },
    { codigo: 'EFM', nombre: 'Marcha rapida' },
    { codigo: 'EFM', nombre: 'Ascenso a la cuerda' },
    { codigo: 'EFM', nombre: 'Cruce de obstaculos' },
    { codigo: 'EFM', nombre: 'Aerobica' },
    { codigo: 'EFM', nombre: 'Natacion estilo crol' },
    { codigo: 'EFM', nombre: 'Peso' },
    { codigo: 'EFM', nombre: 'Talla' },
    { codigo: 'EFM', nombre: 'Contextura Fisica' },
    { codigo: 'EFM', nombre: 'Gestion' }
  ];

  materiasBasico = [
    { codigo: 'BAS-CMI-01-02', nombre: 'Correspondencia Militar' },
    { codigo: 'BAS-DCO-01-04', nombre: 'Documentación del Primero de Comp., Edron o Btr.' },
    { codigo: 'BAS-DOU-01-07', nombre: 'Doctrina de Operaciones Urbanas' },
    { codigo: 'BAS-EFM-01-01', nombre: 'Entrenamiento Físico Militar' },
    { codigo: 'BAS-EST-01-05', nombre: 'Estudio del Terreno' },
    { codigo: 'BAS-PLA-01-06', nombre: 'Planeamiento' },
    { codigo: 'BAS-RMI-01-01', nombre: 'Redacción Militar' },
    { codigo: 'COM-GEN-01-03', nombre: 'Normativa de Género' },
    { codigo: 'COM-LID-01-02', nombre: 'Liderazgo' },
    { codigo: 'PROY-I-II', nombre: 'Proyectos I y II' },
    { codigo: 'TEC-GAE-01-02', nombre: 'Geoprocesamiento y Análisis Espacial' },
    { codigo: 'TEC-MDT-01-04', nombre: 'Modelamiento Digital del Terreno y Simulación' },
    { codigo: 'TEC-PRS-01-05', nombre: 'Programación SIG.' },
    { codigo: 'TEC-RGE-01-03', nombre: 'Redes Geodésicas I' },
    { codigo: 'TEC-TOA-01-01', nombre: 'Topografía Automatizada' },
    { codigo: 'TEC-TOV-01-06', nombre: 'Topografía Vial' },
    { codigo: 'promedioDisciplina', nombre: 'Promedio disciplina' },
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' },
    { codigo: 'ordenMerito', nombre: 'Orden de Merito' },
    { codigo: 'ordenTotal', nombre: 'Total Efectivo' },
    { codigo: 'gestionBasico', nombre: 'Gestión Basico' }
  ];
  materiasAvanzado = [
    { codigo: 'BAS-ASI-01-02', nombre: 'Asignatura Militar I' },
    { codigo: 'BAS-ASO-01-03', nombre: 'Asignatura Operativa' },
    { codigo: 'BAS-ASP-01-01', nombre: 'Asignatura Profesional' },
    { codigo: 'BAS-PICB-01-07', nombre: 'Plan Integral de Capacitación Básica' },
    { codigo: 'COM-CPM-01-01', nombre: 'Comunicación para el Mando' },
    { codigo: 'COM-SSU-01-02', nombre: 'Seguridad y Soporte de Unidades' },
    { codigo: 'EJT-AEM-01-01', nombre: 'Ejercicio de Aplicación Militar' },
    { codigo: 'PFD-EFM-01-01', nombre: 'Educación Física Militar' },
    { codigo: 'TEC-BDG-01-06', nombre: 'Base de Datos Geográficos' },
    { codigo: 'TEC-CTE-01-09', nombre: 'Cartografía Temática' },
    { codigo: 'TEC-GPR-01-04', nombre: 'Gestión de Proyectos' },
    { codigo: 'TEC-SCT-01-08', nombre: 'Sistemas de Control Topográfico' },
    { codigo: 'TEC-TIN-01-07', nombre: 'Tecnología de Información' },
    { codigo: 'TIT-TTE-01-01', nombre: 'Trabajo de Titulación' },
    { codigo: 'promedioDisciplina', nombre: 'Promedio disciplina' },
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' },
    { codigo: 'ordenMerito', nombre: 'Orden de Merito' },
    { codigo: 'ordenTotal', nombre: 'Total Efectivo' },
    { codigo: 'gestionAvanzado', nombre: 'Gestión Avanzado' }
  ];

  materiasPrimerSemestre = [
    { codigo: 'BAS-ASI-01-02', nombre: 'Asignatura Militar I' },
    { codigo: 'BAS-ASO-01-03', nombre: 'Asignatura Operativa' },
    { codigo: 'BAS-ASP-01-01', nombre: 'Asignatura Profesional' },
    { codigo: 'BAS-PICB-01-07', nombre: 'Plan Integral de Capacitación Básica' },
    { codigo: 'COM-CPM-01-01', nombre: 'Comunicación para el Mando' },
    { codigo: 'COM-SSU-01-02', nombre: 'Seguridad y Soporte de Unidades' },
    { codigo: 'EJT-AEM-01-01', nombre: 'Ejercicio de Aplicación Militar' },
    { codigo: 'PFD-EFM-01-01', nombre: 'Educación Física Militar' },
    { codigo: 'TEC-BDG-01-06', nombre: 'Base de Datos Geográficos' },
    { codigo: 'TEC-CTE-01-09', nombre: 'Cartografía Temática' },
    { codigo: 'TEC-GPR-01-04', nombre: 'Gestión de Proyectos' },
    { codigo: 'TEC-SCT-01-08', nombre: 'Sistemas de Control Topográfico' },
    { codigo: 'TEC-TIN-01-07', nombre: 'Tecnología de Información' },
    { codigo: 'TIT-TTE-01-01', nombre: 'Trabajo de Titulación' },
    { codigo: 'promedioDisciplina', nombre: 'Promedio disciplina' },
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' },
    { codigo: 'ordenMerito', nombre: 'Orden de Merito' },
    { codigo: 'ordenTotal', nombre: 'Total Efectivo' },
    { codigo: 'gestionAvanzado', nombre: 'Gestión Avanzado' }
  ];

  notasRegistradas: { [codigo: string]: number | null } = {};
  cantidadesRegistradas: { [codigo: string]: number | null } = {};
  estudiante: any = null;
  nivelSeleccionado: string = '';
  nivelSeleccionado2: string = '';
  cargandoNotas: boolean = false;
  cargandoNotas2: boolean = false;
  editarNotas: boolean = false;
  codigo1Generado = '';
  codigo2Generado = '';
  codigo1Ingresado = '';
  codigo2Ingresado = '';
  puedeEditarTodo = false;
  private subscription!: Subscription;
  readonly dialog = inject(MatDialog);

  constructor(private estudianteService: EstudianteService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
    this.obtenerFirmas();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  async obtenerFirmas() {
    const firmas = await this.estudianteService.obtenerFirmas();
    if (firmas) {
      this.jefe.set(firmas['jefe']);
      this.comandante.set(firmas['comandante']);
      console.log("Firmas obtenidas:", firmas);
    } else {
      console.log("No se encontraron firmas en Firebase.");
    }
  }

parseHHMMSSToSeconds(t: string): number {
  const parts = t.split(":").map(Number);
  if (parts.some(isNaN)) throw new Error(`Tiempo inválido: ${t}`);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  } else if (parts.length === 1) {
    return parts[0];
  }
  throw new Error(`Formato no soportado: ${t}`);
}

tablaMarchaRapidaSec: Record<number, Partial<Record<Grado, number>>> = 
  Object.fromEntries(
    Object.entries(this.tablaMarchaRapidaHH).map(([nota, porGrado]) => {
      const convertido: Partial<Record<Grado, number>> = {};
      for (const g of ["3ER_AM", "2DO_AM", "1ER_AM"] as const) {
        const tiempoHH = porGrado[g];
        if (tiempoHH) {
          convertido[g] = this.parseHHMMSSToSeconds(tiempoHH);
        }
      }
      return [Number(nota), convertido];
    })
  );

  calcularNotaMarchaRapida(
    tiempo: string | number,
    grado: Grado,
    genero: Genero
  ): number {
    const gradosValidos: Grado[] = ["3ER_AM", "2DO_AM", "1ER_AM"];
    if (!gradosValidos.includes(grado)) {
      console.warn("Grado inválido:", grado);
      return 0;
    }

    const tiempoSeg = typeof tiempo === "number" ? tiempo : this.parseHHMMSSToSeconds(tiempo);

    const notasOrdenadasDesc = Object.keys(this.tablaMarchaRapidaSec)
      .map(Number)
      .sort((a, b) => b - a);

    for (const nota of notasOrdenadasDesc) {
      const tiempoMax = this.tablaMarchaRapidaSec[nota]?.[grado];
      if (typeof tiempoMax === "number" && tiempoSeg <= tiempoMax) {
        return nota; // devuelve nota entera
      }
    }

    return 0.1; // si no alcanza ningún umbral
  }


calcularNotaFlexiones(
  repeticiones: number,
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM",
  genero: "Masculino" | "Femenino"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;

  if (!gradosValidos.includes(grado)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  const tabla =
    genero === "Masculino"
      ? this.tablaFlexionesM
      : genero === "Femenino"
      ? this.tablaFlexionesF
      : null;

  if (!tabla) {
    console.warn("Género no reconocido:", genero);
    return 0;
  }

  // ✅ Recorremos las notas reales (pueden ser decimales)
  const notasOrdenadasDesc = Object.keys(tabla)
    .map(Number)
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => b - a);

  for (const nota of notasOrdenadasDesc) {
    const valorRequerido = tabla[nota]?.[grado];
    if (valorRequerido !== undefined && repeticiones >= valorRequerido) {
      return Number(nota.toFixed(2)); // ← devuelve con dos decimales si aplica
    }
  }

  return 0.1; // No alcanzó ningún valor mínimo
}


calcularNotaFlexionesBarra(
  repeticiones: number,
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM",
  genero: "Masculino" | "Femenino"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;
  if (!gradosValidos.includes(grado)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  // ✅ Usa la tabla correcta según género
  const tabla: TablaFlexiones =
    genero === "Masculino"
      ? this.tablaFlexionesBarraM
      : genero === "Femenino"
      ? this.tablaFlexionesBarraF
      : null as any;

  if (!tabla) {
    console.warn("Género no reconocido:", genero);
    return 0;
  }

  // ✅ Recorremos las llaves reales (incluye 88.8, 77.7, etc.)
  const notasOrdenadasDesc = Object.keys(tabla)
    .map(Number)
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => b - a);

  for (const nota of notasOrdenadasDesc) {
    const valorRequerido = tabla[nota as keyof typeof tabla]?.[grado];
    if (valorRequerido === undefined) continue;

    // Opcional: si usas 0.1 como “mínimo simbólico”, puedes normalizarlo a 0:
    const minimo = valorRequerido <= 0.1 ? 0 : valorRequerido;

    if (repeticiones >= minimo) {
      // ✅ Devuelve entero aunque la llave sea decimal
      // return Math.round(nota);
      return Number(nota.toFixed(2));
    }
  }

  return 0.1;
}

calcularNotaCuerda(
  tiempo: number, // en segundos o tu unidad
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM",
  genero: "Masculino" | "Femenino"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;
  if (!gradosValidos.includes(grado)) return 0;

  const tabla =
    genero === "Masculino" ? this.tablaCuerdaM
    : genero === "Femenino" ? this.tablaCuerdaF
    : null;

  if (!tabla) return 0;

  const notasOrdenadasDesc = Object.keys(tabla)
    .map(Number)
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => b - a);

  const EPS = 1e-9;
  for (const nota of notasOrdenadasDesc) {
    const tiempoMax = tabla[nota]?.[grado];
    if (typeof tiempoMax !== "number") continue;
    if (tiempo <= tiempoMax + EPS) return Number(nota); // ¡menor es mejor!
  }
  return 0.1;
}

calcularNotaJardin(
  tiempo: number | string,
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;
  if (!gradosValidos.includes(grado)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  // Convierte tiempo a número si viene como string (ej. "4.42")
  const tiempoNum = typeof tiempo === "number" ? tiempo : parseFloat(tiempo);

  const notasOrdenadasDesc = Object.keys(this.tablaJardin)
    .map(Number)
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => b - a); // de mayor a menor

  for (const nota of notasOrdenadasDesc) {
    const tiempoMax = this.tablaJardin[nota as keyof typeof this.tablaJardin]?.[grado];
    if (typeof tiempoMax !== "number") continue;
    if (tiempoNum <= tiempoMax) {
      return Number(nota.toFixed(2)); // devuelve la nota correspondiente
    }
  }

  return 0; // si no alcanza ningún umbral
}



/** Convierte números en formato mm.ss a segundos (ej: 4.15 -> 255 s) */
 mmssNumberToSeconds(v: number): number {
  const minutos = Math.trunc(v);
  const segundos = Math.round((v - minutos) * 100); // 4.15 -> 4 min 15 s
  return minutos * 60 + segundos;
}

calcularNotaAero(
  tiempo: number | string, // en segundos o formato mm.ss
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM",
  genero: "Masculino" | "Femenino"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;
  if (!gradosValidos.includes(grado)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  // ✅ Selecciona tabla según género
  const tabla =
    genero === "Masculino"
      ? this.tablaAeroM
      : genero === "Femenino"
      ? this.tablaAeroF
      : null;

  if (!tabla) {
    console.warn("Género no reconocido:", genero);
    return 0;
  }

  // ✅ Convierte a número en segundos
  const tiempoSeg =
    typeof tiempo === "number"
      ? this.mmssNumberToSeconds(tiempo)
      : this.mmssNumberToSeconds(parseFloat(tiempo));

  // ✅ Recorremos las notas ordenadas de mayor a menor
  const notasOrdenadasDesc = Object.keys(tabla)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => b - a);

  for (const nota of notasOrdenadasDesc) {
    const tiempoMax = tabla[nota as keyof typeof tabla]?.[grado];
    if (typeof tiempoMax !== "number") continue;

    const tiempoMaxSeg = this.mmssNumberToSeconds(tiempoMax);

    // ⚡ Aeróbico: MENOR tiempo = MEJOR nota
    if (tiempoSeg <= tiempoMaxSeg) {
      return Number(nota.toFixed(2));
    }
  }

  return 0.1; // no alcanzó ningún umbral
}

calcularPuntajeContextura(altura: number, peso: number, genero: "Masculino" | "Femenino"): number {
  const tabla =
  genero === "Masculino"
    ? this.tablaContexturaFisicaM
    : genero === "Femenino"
    ? this.tablaContexturaFisicaF
    : null;
  if (!tabla) {
    console.warn("Género no reconocido:", genero);
    return 0;
  }
  for (const rango of tabla) {
    if (altura >= rango.alturaMin && altura <= rango.alturaMax) {
      if (peso >= rango.pesoMin && peso <= rango.pesoMax) {
        return rango.puntaje;
      } else {
        return 0.1;
      }
    }
  }
  return 0; // Si la altura no está en ningún rango
}

anyTimeToSeconds(t: number | string): number {
  if (typeof t === 'number') return this.mmssNumberToSeconds(t);
  const str = String(t).trim();

  // Soporta hh:mm:ss o mm:ss
  if (str.includes(':')) {
    const parts = str.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3) {
      const [hh, mm, ss] = parts;
      return (hh * 3600) + (mm * 60) + ss;
    } else if (parts.length === 2) {
      const [mm, ss] = parts;
      return (mm * 60) + ss;
    }
  }

  // Como fallback, intenta mm.ss como número
  const asNum = parseFloat(str);
  if (!Number.isNaN(asNum)) return this.mmssNumberToSeconds(asNum);

  console.warn('Formato de tiempo no reconocido para natación:', t);
  return Number.POSITIVE_INFINITY; // fuerza a no aprobar ningún umbral
}

calcularNotaNatacion(
  tiempo: number | string, // mm.ss | "mm:ss" | "hh:mm:ss"
  grado: "3ER_AM" | "2DO_AM" | "1ER_AM"
): number {
  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;
  if (!gradosValidos.includes(grado)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  // Usa tu tabla exportada/inyectada
  const tabla = this.tablaNatacion; // asegúrate de tenerla accesible como propiedad de la clase

  if (!tabla) {
    console.warn("Tabla de natación no disponible.");
    return 0;
  }

  // Normaliza el tiempo del postulante a segundos
  const tiempoSeg = this.anyTimeToSeconds(tiempo);

  // Notas descendentes (100 → 0)
  const notasOrdenadasDesc = Object.keys(tabla)
    .map(Number)
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => b - a);

  for (const nota of notasOrdenadasDesc) {
    const umbral = tabla[nota as keyof typeof tabla]?.[grado];
    // En esta tabla, los umbrales vienen como mm.ss (número)
    if (typeof umbral !== 'number') continue;

    const umbralSeg = this.mmssNumberToSeconds(umbral);

    // Natación: menor tiempo es mejor (<= umbral)
    if (tiempoSeg <= umbralSeg) {
      return Number(nota.toFixed(2));
    }
  }

  // No alcanzó ningún umbral
  return 0.1;
}

Gestion(
  valor: number | string
): number {
  if (!valor) {
    console.warn("Gestión vacía o inválida:", valor);
    return 0;
  }

  // Si viene como string, conviértelo a número
  const anio = typeof valor === "string" ? parseInt(valor, 10) : valor;

  if (isNaN(anio)) {
    console.warn("Gestión no es un número válido:", valor);
    return 0;
  }

  return anio; // 👈 devuelve el año tal cual, sin cálculo
}

  promPruebas(): number {
  if (!this.notasRegistradas) return 0;

  // listado de pruebas que entran en el promedio
  const pruebas = [
    'Flexiones',
    'Abdominales',
    'Flexiones en barra',
    'Marcha rapida',
    'Ascenso a la cuerda',
    'Cruce de obstaculos',
    'Aerobica',
    'Natacion estilo crol'
  ];

  let suma = 0;
  let count = 0;

  for (const prueba of pruebas) {
    const nota = this.notasRegistradas[prueba];
    if (typeof nota === 'number' && !isNaN(nota)) {
      suma += nota;
      count++;
    }
  }

  if (count === 0) return 0;
  return +(suma / count).toFixed(2); // con dos decimales
}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {jefe: this.jefe(), comandante: this.comandante()},
      // data: {jefe: '', comandante: ''},
      width:'400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result) {
        this.jefe.set(result.jefe);
        this.comandante.set(result.comandante);
      }
    });
  }

  edit(){
    if (!this.estudiante?.id || !this.nivelSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar un nivel antes de continuar.'
      });
      return;
    }

    this.editarNotas = !this.editarNotas;
    this.codigo1Generado = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigo2Generado = Math.floor(100000 + Math.random() * 900000).toString();
    this.enviarCodigosPorCorreo();
  }

  enviarCodigosPorCorreo() {
    console.log(`Código 1 para cidarandresdac@gmail.com: ${this.codigo1Generado}`);
    console.log(`Código 2 para cidardealencar@gmail.com: ${this.codigo2Generado}`);
  }


  editEnable() {
    if (
      this.codigo1Ingresado === this.codigo1Generado &&
      this.codigo2Ingresado === this.codigo2Generado
    ) {
      this.puedeEditarTodo = true;
      // editar aca
      alert('Autenticación correcta. Edición habilitada.');
    } else {
      alert('Códigos incorrectos. Intenta nuevamente.');
    }
  }


  getInputId(codigo: string): string {
    return 'nota_' + codigo.replace(/-/g, '_');
  }

  getHintId(codigo: string): string {
    return 'hint_' + codigo.replace(/-/g, '_');
  }


  async save() {
    if (!this.estudiante?.id || !this.nivelSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar un nivel antes de continuar.'
      });
      return;
    }

    const ci = this.estudiante.id;
    const nivel = this.nivelSeleccionado;

    const codigosPorNivel: { [key: string]: string[] } = {
      basico: [
        'BAS-CMI-01-02',
        'BAS-DCO-01-04',
        'BAS-DOU-01-07',
        'BAS-EFM-01-01',
        'BAS-EST-01-05',
        'BAS-PLA-01-06',
        'BAS-RMI-01-01',
        'COM-GEN-01-03',
        'COM-LID-01-02',
        'PROY-I-II',
        'TEC-GAE-01-02',
        'TEC-MDT-01-04',
        'TEC-PRS-01-05',
        'TEC-RGE-01-03',
        'TEC-TOA-01-01',
        'TEC-TOV-01-06',
        'promedioDisciplina',
        'promedioFisico'
      ],
      avanzado: [
        'BAS-ASI-01-02',
        'BAS-ASO-01-03',
        'BAS-ASP-01-01',
        'BAS-PICB-01-07',
        'COM-CPM-01-01',
        'COM-SSU-01-02',
        'EJT-AEM-01-01',
        'PFD-EFM-01-01',
        'TEC-BDG-01-06',
        'TEC-CTE-01-09',
        'TEC-GPR-01-04',
        'TEC-SCT-01-08',
        'TEC-TIN-01-07',
        'TIT-TTE-01-01',
        'promedioDisciplina',
        'promedioFisico',
        'ordenMerito',
        'ordenTotal',
        'gestionAvanzado'
      ]
      // Puedes agregar aquí otros niveles como 'avanzado', 'primerSemestre', etc.
    };

    const codigos = codigosPorNivel[nivel] || [];

    for (const codigo of codigos) {
      try {
        const inputId = `nota_${codigo.replace(/-/g, '_')}`;
        const hintId = `hint_${codigo.replace(/-/g, '_')}`;

        const inputEl = document.getElementById(inputId) as HTMLInputElement;
        const hintEl = document.getElementById(hintId) as HTMLElement;

        if (!inputEl || !hintEl) {
          console.warn(`Elementos no encontrados para ${codigo}`);
          continue;
        }

        const valor  = parseFloat(inputEl.value);
        const nombre = hintEl.innerText.trim();

        if (!isNaN(valor )) {
          let ref;
          let data: any = {};
          if (codigo === 'ordenMerito') {
            ref = doc(this.firestore, `estudiante/${ci}/${nivel}/ordenMerito`);
            data = { orden: valor };
          } else if (codigo === 'ordenTotal') {
            ref = doc(this.firestore, `estudiante/${ci}/${nivel}/ordenMerito`);
            data = { total: valor };
          } else if (codigo === 'gestionAvanzado') {
            ref = doc(this.firestore, `estudiante/${ci}/${nivel}/gestionAvanzado`);
            data = { gestion: valor };
          } else {
            ref = doc(this.firestore, `estudiante/${ci}/${nivel}/${codigo}`);
            data = {
              nota1: valor,
              nombre: nombre
            };
          }
          await setDoc(ref, data, { merge: true });
          // const ref = doc(this.firestore, `estudiante/${ci}/${nivel}/${codigo}`);
          // await setDoc(ref, {
          //   nota1: nota,
          //   nombre: nombre
          // });
          console.log(`Guardado ${codigo}:`, data);
        } else {
          console.warn(`Nota inválida para ${codigo}`);
        }

      } catch (error) {
        console.error(`Error al guardar nota de ${codigo}:`, error);
      }
    }
    this.nivelSeleccionado = '';
    this.puedeEditarTodo = false;
    // alert('Notas guardadas correctamente.');
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Notas guardadas correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
  }

async savePhysicist() {
  if (!this.estudiante?.id || !this.nivelSeleccionado2) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Debes seleccionar un nivel antes de continuar.'
    });
    return;
  }

  const ci = this.estudiante.id;
  const nivel = this.nivelSeleccionado2;
  let gradoStudent = this.estudiante.grado;
  // const grado = nivel.toUpperCase() as '3ER_AM' | '2DO_AM' | '1ER_AM';
  let grado: '1ER_AM' | '2DO_AM' | '3ER_AM';

  switch (gradoStudent) {
    case 'Al. 1er. AM.':
      grado = '1ER_AM';
      break;
    case 'Al. 2do. AM.':
      grado = '2DO_AM';
      break;
    case 'Al. 3er. AM.':
      grado = '3ER_AM';
      break;
    default:
      console.warn('Nivel no reconocido:', nivel);
      return;
  }

  const genero = this.estudiante.genero as 'Masculino' | 'Femenino';

  const datosEFM: any = {};
   let altura: number | null = null; // Talla / Altura (en metros o cm, ver nota)
  let peso: number | null = null;   // Peso en kg
  let requiereContextura = false;

  // for (const materia of this.pruebasFisicas) {
  //   const nombre = materia.nombre;
  //   const inputId = `nota_${nombre.replace(/\s+/g, '_')}`;
  //   const inputEl = document.getElementById(inputId) as HTMLInputElement;

  //   if (!inputEl) {
  //     console.warn(`Input no encontrado para ${nombre}`);
  //     continue;
  //   }

  //   const valor = parseFloat(inputEl.value);
  //   if (isNaN(valor)) {
  //     console.warn(`Valor inválido para ${nombre}`);
  //     continue;
  //   }

  //   if (nombre.toLowerCase().includes('flexiones en barra')) {
  //     datosEFM[nombre] = this.calcularNotaFlexionesBarra(valor, grado, genero);
  //     console.log(valor);
  //   } else if (nombre.toLowerCase().includes('flexiones')) {
  //     datosEFM[nombre] = this.calcularNotaFlexiones(valor, grado, genero);
  //   } else if (nombre.toLowerCase().includes('abdominales')) {
  //     datosEFM[nombre] = this.calcularNotaFlexiones(valor, grado, genero);
  //   }  else if (nombre.toLowerCase().includes('marcha rapida')) {
  //     const tiempoStr = inputEl.value.trim(); // "HH:mm:ss" o "mm:ss"
  //     if (!tiempoStr) { console.warn(`Tiempo vacío para ${nombre}`); continue; }
  //     datosEFM[nombre] = this.calcularNotaMarchaRapida(tiempoStr, grado, genero);
  //   } else if (nombre.toLowerCase().includes('ascenso a la cuerda')) {
  //     datosEFM[nombre] = this.calcularNotaCuerda(valor, grado, genero);
  //   } else {
  //     datosEFM[nombre] = valor;
  //   }

  // }
// let altura: number | null = null;
// let peso: number | null = null;

for (const materia of this.pruebasFisicas) {
  const nombre = materia.nombre;
  const inputId = `nota_${nombre.replace(/\s+/g, '_')}`;
  const inputEl = document.getElementById(inputId) as HTMLInputElement | null;
  if (!inputEl) continue;

  // 👇 Evita recalcular/sobrescribir lo ya registrado
  // if (inputEl.disabled) continue;

  const raw = (inputEl.value ?? '').trim();
  if (!raw) continue;

  const n = this.normalizaNombre(nombre);

  if (n.includes('marcha rapida')) {
    datosEFM[nombre] = this.calcularNotaMarchaRapida(raw, grado, genero);
    datosEFM[`${nombre}_cant`] = raw;
    continue;
  }

  const valor = parseFloat(raw.replace(',', '.'));

  if (Number.isNaN(valor)) continue;

  if (n.includes('flexiones en barra')) {
    datosEFM[nombre] = this.calcularNotaFlexionesBarra(valor, grado, genero);
    datosEFM[`${nombre}_cant`] = valor;
  } else if (n.includes('ascenso a la cuerda')) {
    datosEFM[nombre] = this.calcularNotaCuerda(valor, grado, genero);
    datosEFM[`${nombre}_cant`] = valor;
  } else if (n.includes('flexiones') || n.includes('abdominales')) {
    datosEFM[nombre] = this.calcularNotaFlexiones(valor, grado, genero);
    datosEFM[`${nombre}_cant`] = valor;

  } else if (n.includes('flexiones') || n.includes('abdominales')) {
    datosEFM[nombre] = this.calcularNotaFlexiones(valor, grado, genero);
    datosEFM[`${nombre}_cant`] = valor;
  } 
  else  if (n.includes('cruce de obstaculos')){
    datosEFM[nombre] = this.calcularNotaJardin(valor, grado);
    datosEFM[`${nombre}_cant`] = valor;
  }else if(n.includes('aerobica')){
    datosEFM[nombre] = this.calcularNotaAero(valor, grado, genero);
    datosEFM[`${nombre}_cant`] = valor;
  }else if(n.includes('natacion estilo crol')){
    datosEFM[nombre] = this.calcularNotaNatacion(valor, grado);
    datosEFM[`${nombre}_cant`] = valor;
  }else if (n.includes('peso')) {
    peso = valor;
    datosEFM[nombre] = valor;
  }else if (n.includes('talla')) {
    altura = valor
    datosEFM[nombre] = valor;
  }
  // else if (n.includes('contextura fisica')) {
  //   // requiereContextura = true;
  //   datosEFM[nombre] = this.calcularPuntajeContextura(altura!,peso!);
  // }
  else if (n.includes('gestion')) {
    datosEFM[nombre] = this.Gestion(valor);
  } else{
    datosEFM[nombre] = valor;
  }
    if (altura != null && peso != null) {
    // Si tu altura viene en cm (ej. 170), convierte a metros solo si hace falta para IMC.
    // Para tabla por rangos, asume que this.tablaContexturaFisica está en las mismas unidades que capturas.
    const puntaje = this.calcularPuntajeContextura(altura, peso ,genero);
    datosEFM['Contextura Fisica'] = puntaje;

    // (Opcional) Guarda también el IMC como "cantidad" de referencia:
    // const alturaM = (altura >= 3 ? altura / 100 : altura); // descomenta si tu altura puede venir en cm
    // datosEFM['Contextura Fisica_cant'] = Number((peso / (alturaM * alturaM)).toFixed(2));
  } else {
    console.warn('Falta Peso y/o Talla para calcular Contextura Física');
    // Si quieres, explícitamente guarda 0 o null
    // datosEFM['Contextura Fisica'] = 0;
  }
  //   if (requiereContextura) {
  //   if (altura != null && peso != null) {
  //     // Si altura viene en cm, descomenta:
  //     // const alturaM = altura >= 3 ? altura / 100 : altura;
  //     const puntaje = this.calcularPuntajeContextura(altura, peso);
  //     datosEFM['Contextura Fisica'] = puntaje;
  //     // Si quieres, puedes guardar también la "cantidad" como IMC u otro índice
  //     // datosEFM['Contextura Fisica_cant'] = (peso / (alturaM * alturaM)).toFixed(2);
  //   } else {
  //     console.warn('Falta Peso y/o Talla para calcular Contextura Física');
  //     datosEFM['Contextura Fisica'] = null; // o 0
  //   }
  // }
}


  try {
    const ref = doc(this.firestore, `estudiante/${ci}/${nivel}/EFM`);
    await setDoc(ref, datosEFM, { merge: true });

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Pruebas físicas guardadas correctamente.',
      timer: 2000,
      showConfirmButton: false
    });

    this.nivelSeleccionado2 = '';
    this.puedeEditarTodo = false;
  } catch (error) {
    console.error('Error al guardar pruebas físicas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al guardar las pruebas físicas.'
    });
  }
}


  async obtenerNotas() {
    const extras = ['promedioDisciplina', 'promedioFisico', 'ordenMerito', 'ordenTotal', 'gestionAvanzado'];
    this.cargandoNotas = true;
    try {
      const notas = await this.estudianteService.obtenerNotas(this.estudiante.id, this.nivelSeleccionado);
      this.notasRegistradas = {};
      console.log(notas);
      for (const codigo in notas) {
        if(extras.includes(codigo) ){
          this.notasRegistradas[codigo] = notas[codigo] ?? null;
        }else{
          this.notasRegistradas[codigo] = notas[codigo]?.nota ?? null;
        }
      }
    } finally {
      this.cargandoNotas = false;
    }
  }

async obtenerNotasFisico() {
  this.cargandoNotas2 = true;

  try {
    if (!this.estudiante?.id || !this.nivelSeleccionado2) {
      console.warn("Faltan datos para obtener notas físicas.");
      return;
    }

    const datos = await this.estudianteService.obtenerNotasFisicas(
      this.estudiante.id,
      this.nivelSeleccionado2
    );

    console.log(datos);

    this.notasRegistradas = {};
    this.cantidadesRegistradas = {};

    for (const prueba of this.pruebasFisicas) {
      const nombre = prueba.nombre;
      this.notasRegistradas[nombre] = datos[nombre] ?? null;
      this.cantidadesRegistradas[`${nombre}_cant`] = datos[`${nombre}_cant`] ?? null;
    }

    console.log("Notas físicas obtenidas:", this.notasRegistradas);
    console.log("Cantidades físicas obtenidas:", this.cantidadesRegistradas);
    } catch (error) {
      console.error("Error al procesar notas físicas:", error);
      this.notasRegistradas = {};
      this.cantidadesRegistradas = {};
    } finally {
      this.cargandoNotas2 = false;
    }
  }

  onNivelChange() {
    if (this.estudiante?.id && this.nivelSeleccionado) {
      this.obtenerNotas();
    }
  }

  onNivelChangePhysicist() {
    if (this.estudiante?.id && this.nivelSeleccionado2) {
      this.obtenerNotasFisico();
    }
  }

  // validarRango(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   let valor = parseFloat(input.value);

  //   if (isNaN(valor) || valor < 0) {
  //     input.value = '0';
  //   } else if (valor > 100) {
  //     input.value = '100';
  //   }
  // }
  normalizaNombre(s: string): string {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }


esGestion(nombre: string): boolean {
  const n = this.normalizaNombre(nombre);
  return n === 'gestion' || n.includes('gestion');
}

validarRango(event: Event, materiaNombre: string, fase: 'input' | 'blur' = 'input') {
  const input = event.target as HTMLInputElement;
  const nombreN = this.normalizaNombre(materiaNombre);

  //  if (this.esGestion(nombreN)) {
  //   if (fase === 'input') {
  //     // opcional: si quieres solo dígitos (y guion por si acaso)
  //     input.value = input.value.replace(/[^\d-]/g, '');
  //   }
  //   const val = input.value === '' ? null : Number(input.value);
  //   this.notasRegistradas[materiaNombre] = Number.isNaN(val) ? input.value : val;
  //   return;
  // }
  if (this.esGestion(nombreN)) {
    if (fase === 'input') {
      // opcional: si quieres solo dígitos (y guion por si acaso)
      input.value = input.value.replace(/[^\d-]/g, '');
    }
    // const val = input.value === '' ? null : Number(input.value);
    // this.notasRegistradas[materiaNombre] = Number.isNaN(val) ? input.value : val;
    return;
  }

  // Resto de materias: numérico 0..100 (como ya tenías)
  if (nombreN !== 'marcha rapida') {
    const v = parseFloat(input.value);
    if (isNaN(v) || v < 0) input.value = '0';
    else if (v > 100) input.value = '100';
    return;
  }

  // --- Marcha rápida ---
  // Limpia caracteres no permitidos mientras escribe
  let valor = input.value.replace(/[^\d:]/g, '');

  // Permite formatos parciales mientras escribe: "H", "HH", "HH:", "HH:m", "mm:ss", "HH:mm:ss"
  const parcialOk = /^\d{0,2}(:\d{0,2}){0,2}$/.test(valor) && (valor.match(/:/g)?.length ?? 0) <= 2;

  // Guarda/recupera último válido "parcial"
  const lastGood = (input.dataset as any).lastGood ?? '';
  if (fase === 'input') {
    if (!parcialOk) {
      // revertir al último bueno para no vaciar el campo
      input.value = lastGood;
      return;
    }
    // limitar longitud (máx "HH:mm:ss" = 8)
    if (valor.length > 8) valor = valor.slice(0, 8);
    input.value = valor;
    (input.dataset as any).lastGood = valor;
    return;
  }

  // En blur: validación estricta HH:mm:ss o mm:ss con rangos válidos
  // Normaliza a HH:mm:ss si viene mm:ss
  const partes = valor.split(':').filter(p => p !== '');
  if (partes.length === 2) {
    // mm:ss -> HH:mm:ss con HH=00
    valor = `00:${partes[0].padStart(2,'0')}:${partes[1].padStart(2,'0')}`;
  } else if (partes.length === 3) {
    valor = `${partes[0].padStart(2,'0')}:${partes[1].padStart(2,'0')}:${partes[2].padStart(2,'0')}`;
  }

  const estricta = /^(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/; // HH:mm:ss con rangos válidos
  if (!estricta.test(valor)) {
    // si es inválido al salir, deja el último "bueno" parcial y avisa
    console.warn('Formato inválido. Usa HH:mm:ss o mm:ss');
    input.value = lastGood;
    return;
  }

  // OK final
  input.value = valor;
  (input.dataset as any).lastGood = valor;
}


  debeValidarRango(codigo: string): boolean {
    const excepciones = ['ordenTotal', 'ordenMerito', 'gestionAvanzado'];
    return !excepciones.includes(codigo);
  }

  async printEFM() {
    this.today = new Date();
    this.generandoPDF = true;
    setTimeout(async () => {
      const content = this.pdfContentEFM.nativeElement; // 👈 referencia nueva
      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');

      const pageWidth = 215.9; // carta
      const pageHeight = 279.4;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save('efm.pdf');

      this.generandoPDF = false;
    }, 500);
}



}
