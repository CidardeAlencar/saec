import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Option {
  value: string;
  viewValue: string;
}

export interface PeriodicElement {
  materia: string;
  position: number;
  promedio: number;
  literal: string;
  // obs: string;
  codigo: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, materia: 'GEOPROCESAMIENTO Y ANÁLISIS ESPACIAL', promedio: 0, literal: ''},
//   {position: 2, materia: 'REDES GEODÉSICAS', promedio: 0, literal: ''},
//   {position: 3, materia: 'MODELAMIENTO DIGITAL DEL TERRENO Y SIMULACIÓN', promedio: 82.10, literal: ''},
//   {position: 4, materia: 'TOPOGRAFÍA AUTOMATIZADA', promedio: 0, literal: ''},
//   {position: 5, materia: 'PROGRAMACIÓN SIG', promedio: 0, literal: ''},
//   {position: 6, materia: 'PROYECTOS I Y II', promedio: 0, literal: ''},
//   {position: 7, materia: 'TOPOGRAFÍA VIAL', promedio: 0, literal: ''},
//   {position: 8, materia: 'CORRESPONDENCIA MILITAR', promedio: 0, literal: ''},
//   {position: 9, materia: 'ESTUDIO DEL TERRENO', promedio: 0, literal: ''},
//   {position: 10, materia: 'NORMATIVA DE GENERO', promedio: 0, literal: ''},
//   {position: 11, materia: 'DOC. DEL PRIMERO DE COMP. EDRON. O BAT', promedio: 0, literal: ''},
//   {position: 12, materia: 'PLANEAMIENTO (PCT)', promedio: 0, literal: ''},
//   {position: 13, materia: 'DOCTRINA DE OPERACIONES URBANAS', promedio: 0, literal: ''},
//   {position: 14, materia: 'LIDERAZGO', promedio: 0, literal: ''},
// ];
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, materia: '', promedio: 0, literal: '', codigo: 'BAS-CMI-01-02' },
  { position: 2, materia: '', promedio: 0, literal: '', codigo: 'BAS-DCO-01-04' },
  { position: 3, materia: '', promedio: 0, literal: '', codigo: 'BAS-DOU-01-07' },
  { position: 4, materia: '', promedio: 0, literal: '', codigo: 'BAS-EFM-01-01' },
  { position: 5, materia: '', promedio: 0, literal: '', codigo: 'BAS-EST-01-05' },
  { position: 6, materia: '', promedio: 0, literal: '', codigo: 'BAS-PLA-01-06' },
  { position: 7, materia: '', promedio: 0, literal: '', codigo: 'BAS-RMI-01-01' },
  { position: 8, materia: '', promedio: 0, literal: '', codigo: 'COM-GEN-01-03' },
  { position: 9, materia: '', promedio: 0, literal: '', codigo: 'COM-LID-01-02' },
  { position: 10, materia: '', promedio: 0, literal: '', codigo: 'PROY-I-II' },
  { position: 11, materia: '', promedio: 0, literal: '', codigo: 'TEC-GAE-01-02' },
  { position: 12, materia: '', promedio: 0, literal: '', codigo: 'TEC-MDT-01-04' },
  { position: 13, materia: '', promedio: 0, literal: '', codigo: 'TEC-PRS-01-05' },
  { position: 14, materia: '', promedio: 0, literal: '', codigo: 'TEC-RGE-01-03' },
  { position: 15, materia: '', promedio: 0, literal: '', codigo: 'TEC-TOA-01-01' },
  { position: 16, materia: '', promedio: 0, literal: '', codigo: 'TEC-TOV-01-06' }
];

const ELEMENT_DATA2: PeriodicElement[] = [
  { position: 1, materia: '', promedio: 0, literal: '', codigo: 'BAS-ASI-01-02' },
  { position: 2, materia: '', promedio: 0, literal: '', codigo: 'BAS-ASO-01-03' },
  { position: 3, materia: '', promedio: 0, literal: '', codigo: 'BAS-ASP-01-01' },
  { position: 4, materia: '', promedio: 0, literal: '', codigo: 'BAS-PICB-01-07' },
  { position: 5, materia: '', promedio: 0, literal: '', codigo: 'COM-CPM-01-01' },
  { position: 6, materia: '', promedio: 0, literal: '', codigo: 'EJT-AEM-01-01' },
  { position: 7, materia: '', promedio: 0, literal: '', codigo: 'PFD-EFM-01-01' },
  { position: 8, materia: '', promedio: 0, literal: '', codigo: 'TEC-BDG-01-06' },
  { position: 9, materia: '', promedio: 0, literal: '', codigo: 'TEC-CTE-01-09' },
  { position: 10, materia: '', promedio: 0, literal: '', codigo: 'TEC-GPR-01-04' },
  { position: 11, materia: '', promedio: 0, literal: '', codigo: 'TEC-SCT-01-08' },
  { position: 12, materia: '', promedio: 0, literal: '', codigo: 'TEC-TIN-01-07' }
];




// ELEMENT_DATA.forEach(nota => {
//   nota.literal = this.convertirNumeroALiteral(nota.promedio);
// });

export interface DialogData {
  jefe: string;
  comandante: string;
}

@Component({
  selector: 'app-informacion',
  imports: [CommonModule, MatTableModule,MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent implements OnInit, OnDestroy{
  options: Option[] = [
    {value: 'basico', viewValue: 'Básico'},
    {value: 'avanzado', viewValue: 'Avanzado'},
  ];
  estudiante: any = null;
  private subscription!: Subscription;
  readonly jefe = signal('');
  readonly comandante = signal('');
  // readonly name = model('');
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['position', 'semestre', 'promedio', 'literal'];
  dataSourceBasico = ELEMENT_DATA;
  dataSourceAvanzado = ELEMENT_DATA2;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  generandoPDF = false;
  ordenMerito = null;
  ordenTotal = null;
  promedioDisciplina = null;
  promedioFisico = null;
  nivelSeleccionado: string = 'basico';
  promedioAcademico: number = 0;
  fechaHoy: Date = new Date();
  cargandoNotas: boolean = false;



  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
    this.obtenerFirmas();
    // this.convertirNotasLiterales();
    // this.obtenerNotas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // convertirNotasLiterales() {
  //   this.dataSource.forEach(nota => {
  //     nota.literal = this.convertirNumeroALiteral(nota.promedio);
  //   });
  // }

  // async obtenerNotas() {
  //   if (!this.estudiante || !this.estudiante.id) {
  //     console.error("Error: No se encontró el CI del estudiante.");
  //     return;
  //   }

  //   const ci = this.estudiante.id;
  //   // const notas = await this.estudianteService.obtenerNotas(ci);
  //   const notas = await this.estudianteService.obtenerNotas(ci, this.nivelSeleccionado);

  //   if (notas.ordenMerito !== null) {
  //     this.ordenMerito = notas.ordenMerito;
  //   }
  //   if (notas.ordenTotal !== null) {
  //     this.ordenTotal = notas.ordenTotal;
  //   }
  //   if (notas.promedioDisciplina !== null) {
  //     this.promedioDisciplina = notas.promedioDisciplina;
  //   }
  //   if (notas.promedioFisico !== null) {
  //     this.promedioFisico = notas.promedioFisico;
  //   }

  //   // if (notas.BASCMI0102 !== null) {
  //   //   this.dataSource[0].promedio = notas.BASCMI0102;
  //   //   this.dataSource[0].materia = notas.BASCMI0102name ?? '';
  //   //   this.dataSource[0].literal = this.dataSource[0].promedio > 50 ? "APROBADO" : "REPROBADO";
  //   //   // this.dataSource[0].literal = this.convertirNumeroALiteral(notas.notaPrimero);
  //   // }

  //   // if (notas.BASDCO0104 !== null) {
  //   //   this.dataSource[1].promedio = notas.BASDCO0104;
  //   //   this.dataSource[1].materia = notas.BASDCO0104name ?? '';
  //   //   this.dataSource[1].literal = this.dataSource[1].promedio > 50 ? "APROBADO" : "REPROBADO";
  //   //   // this.dataSource[0].literal = this.convertirNumeroALiteral(notas.notaPrimero);
  //   // }
  //   this.dataSource.forEach((item: any) => {
  //     const datosMateria = notas[item.codigo]; // item.codigo debe ser como 'BAS-CMI-01-02'
  //     if (datosMateria && datosMateria.nota !== null) {
  //       item.promedio = datosMateria.nota;
  //       item.materia = datosMateria.nombre ?? '';
  //       item.literal = item.promedio > 50 ? 'APROBADO' : 'REPROBADO';
  //     }
  //   });

  //   const promediosValidos = this.dataSource
  // .map((item: any) => item.promedio)
  // .filter((p: number) => typeof p === 'number' && !isNaN(p));

  //   const sumaPromedios = promediosValidos.reduce((acc: number, val: number) => acc + val, 0);
  //   const promedioGeneral = promediosValidos.length > 0 ? sumaPromedios / promediosValidos.length : 0;

  //   // Puedes almacenarlo en una variable general o en el objeto nota como "promedioacademico"
  //   this.promedioAcademico = promedioGeneral;

  //   // if (notas.notaPrimero !== null) {
  //   //   this.dataSource[0].promedio = notas.notaPrimero;
  //   //   this.dataSource[0].literal = this.convertirNumeroALiteral(notas.notaPrimero);
  //   // }

  //   // if (notas.notaSegundo !== null) {
  //   //   this.dataSource[1].promedio = notas.notaSegundo;
  //   //   this.dataSource[1].literal = this.convertirNumeroALiteral(notas.notaSegundo);
  //   // }
  //   //PROMEDIO
  //   // if(notas.notaPrimero !== null && notas.notaSegundo !== null){
  //   //   this.dataSource[2].promedio = (notas.notaPrimero + notas.notaSegundo)/2;
  //   //   this.dataSource[2].literal = this.convertirNumeroALiteral(this.dataSource[2].promedio);
  //   // }

  // }
  get dataSource(): PeriodicElement[] {
    return this.nivelSeleccionado === 'basico' ? this.dataSourceBasico : this.dataSourceAvanzado;
  }

  async obtenerNotas() {
    if (!this.estudiante || !this.estudiante.id) {
      console.error("Error: No se encontró el CI del estudiante.");
      return;
    }

    this.cargandoNotas = true; // 🔄 Mostrar loader

    try {
      const ci = this.estudiante.id;
      const notas = await this.estudianteService.obtenerNotas(ci, this.nivelSeleccionado);

      if (notas.ordenMerito !== null) this.ordenMerito = notas.ordenMerito;
      if (notas.ordenTotal !== null) this.ordenTotal = notas.ordenTotal;
      if (notas.promedioDisciplina !== null) this.promedioDisciplina = notas.promedioDisciplina;
      if (notas.promedioFisico !== null) this.promedioFisico = notas.promedioFisico;
      if(this.nivelSeleccionado = 'basico'){
        this.dataSourceBasico.forEach((item: any) => {
          const datosMateria = notas[item.codigo];
          if (datosMateria && datosMateria.nota !== null) {
            item.promedio = datosMateria.nota;
            item.materia = datosMateria.nombre ?? '';
            item.literal = item.promedio > 50 ? 'APROBADO' : 'REPROBADO';
          }
        });

        const promediosValidos = this.dataSourceBasico
          .map((item: any) => item.promedio)
          .filter((p: number) => typeof p === 'number' && !isNaN(p));

        const sumaPromedios = promediosValidos.reduce((acc: number, val: number) => acc + val, 0);
        const promedioGeneral = promediosValidos.length > 0 ? sumaPromedios / promediosValidos.length : 0;

        this.promedioAcademico = promedioGeneral;
      }
      if(this.nivelSeleccionado = 'avanzado'){
        this.dataSourceAvanzado.forEach((item: any) => {
          const datosMateria = notas[item.codigo];
          if (datosMateria && datosMateria.nota !== null) {
            item.promedio = datosMateria.nota;
            item.materia = datosMateria.nombre ?? '';
            item.literal = item.promedio > 50 ? 'APROBADO' : 'REPROBADO';
          }
        });

        const promediosValidos = this.dataSourceAvanzado
          .map((item: any) => item.promedio)
          .filter((p: number) => typeof p === 'number' && !isNaN(p));

        const sumaPromedios = promediosValidos.reduce((acc: number, val: number) => acc + val, 0);
        const promedioGeneral = promediosValidos.length > 0 ? sumaPromedios / promediosValidos.length : 0;

        this.promedioAcademico = promedioGeneral;
      }
    } catch (error) {
      console.error('Error al obtener las notas:', error);
    } finally {
      this.cargandoNotas = false; // ✅ Ocultar loader
    }
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
  print(){
    // window.print();
    this.generandoPDF = true;
    setTimeout(async () => {
      const content = this.pdfContent.nativeElement;
      const canvas = await html2canvas(content, { scale: 2, backgroundColor: '#FFFFFF',
        useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');
      // const imgWidth = 216;
      const pageWidth = 215.9; // Ancho en mm para tamaño carta (8.5 pulgadas * 25.4)
      const pageHeight = 279.4;
      // const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save('certificacion.pdf');

      this.generandoPDF = false;
    }, 500);
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

  convertirNumeroALiteral(numero: number): string {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

    const parteEntera = Math.floor(numero);
    const parteDecimal = Math.round((numero - parteEntera) * 100); // Obtiene los decimales

    let literal = "";

    // Convertir parte entera
    if (parteEntera >= 10 && parteEntera < 100) {
      literal = `${decenas[Math.floor(parteEntera / 10)]}`;
      if (parteEntera % 10 !== 0) {
        literal += ` y ${unidades[parteEntera % 10]}`;
      }
    } else {
      literal = unidades[parteEntera];
    }

    // Convertir parte decimal
    if (parteDecimal > 0) {
      let decimalesTexto = Array.from(parteDecimal.toString()).map(digit => unidades[parseInt(digit)]).join(" ");
      literal += ` punto ${decimalesTexto}`;
    }

    return literal.charAt(0).toUpperCase() + literal.slice(1); // Capitalizar primera letra
}



}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
    // MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private estudianteService = inject(EstudianteService);
  // readonly jefe = model(this.data.jefe);
  // readonly comandante = model(this.data.comandante);
  jefe = this.data.jefe;
  comandante = this.data.comandante

  onNoClick(): void {
    this.dialogRef.close();
  }

  // save(){
  //   console.log(this.jefe);
  //   console.log(this.comandante);
  //   this.dialogRef.close({ jefe: this.jefe, comandante: this.comandante });
  // }
  async save() {
    console.log("Guardando en Firebase:", this.jefe, this.comandante);

    const success = await this.estudianteService.guardarFirmas(this.jefe, this.comandante);

    if (success) {
      console.log("Datos guardados correctamente en Firebase");
      this.dialogRef.close({ jefe: this.jefe, comandante: this.comandante });
    } else {
      console.error("Error al guardar en Firebase");
    }
  }
}
