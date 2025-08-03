import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

interface Option {
  value: string;
  viewValue: string;
}

interface TablaFlexiones {
  [nota: number]: {
    "3ER_AM": number;
    "2DO_AM": number;
    "1ER_AM": number;
  };
}

import { MatIconModule } from '@angular/material/icon';
import { AdminRoutingModule } from "../../admin/admin-routing.module";

@Component({
  selector: 'app-cargado',
  imports: [MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, MatButtonModule, CommonModule, MatIconModule, AdminRoutingModule],
  templateUrl: './cargado.component.html',
  styleUrl: './cargado.component.scss'
})

export class CargadoComponent implements OnInit, OnDestroy {
  vistaSeleccionada: string = 'academico';
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
    44:  { "3ER_AM": 41, "2DO_AM": 40, "1ER_AM": 38 },
    42:  { "3ER_AM": 40, "2DO_AM": 38, "1ER_AM": 36 },
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
    8:   { "3ER_AM": 8,  "2DO_AM": 7,  "1ER_AM": 6 },
    6:   { "3ER_AM": 7,  "2DO_AM": 6,  "1ER_AM": 5 },
    4:   { "3ER_AM": 6,  "2DO_AM": 5,  "1ER_AM": 4 },
    2:   { "3ER_AM": 5,  "2DO_AM": 4,  "1ER_AM": 3 },
    0:   { "3ER_AM": 0,  "2DO_AM": 0,  "1ER_AM": 0 }
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

    pruebasFisicas = [
    { codigo: 'EFM', nombre: 'Flexiones' },
    { codigo: 'EFM', nombre: 'Abdominales' },
    { codigo: 'EFM', nombre: 'Flexiones en barra' },
    { codigo: 'EFM', nombre: 'Marcha rapida' },
    { codigo: 'EFM', nombre: 'Ascenso a la cuerda' },
    { codigo: 'EFM', nombre: 'Cruce de obstaculos' },
    { codigo: 'EFM', nombre: 'Aerobica' },
    { codigo: 'EFM', nombre: 'Natacion estilo crol' },
    { codigo: 'EFM', nombre: 'Contextura Fisica' }
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


  constructor(private estudianteService: EstudianteService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  calcularNotaFlexiones(repeticiones: number, grado: string, genero: string): number {
  let tabla: TablaFlexiones;

  const gradosValidos = ["3ER_AM", "2DO_AM", "1ER_AM"] as const;

  if (!gradosValidos.includes(grado as any)) {
    console.warn("Grado inválido:", grado);
    return 0;
  }

  if (genero === 'Masculino') {
    tabla = this.tablaFlexionesM;
  } else if (genero === 'Femenino') {
    tabla = this.tablaFlexionesF; // Asegúrate de tener esta tabla también
  } else {
    console.warn("Género no reconocido:", genero);
    return 0;
  }

  for (let nota = 100; nota >= 0; nota--) {
    const valorRequerido = tabla[nota]?.[grado as typeof gradosValidos[number]];
    if (valorRequerido !== undefined && repeticiones >= valorRequerido) {
      return nota;
    }
  }

  return 0; // No alcanzó ningún valor mínimo
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

  for (const materia of this.pruebasFisicas) {
    const nombre = materia.nombre;
    const inputId = `nota_${nombre.replace(/\s+/g, '_')}`;
    const inputEl = document.getElementById(inputId) as HTMLInputElement;

    if (!inputEl) {
      console.warn(`Input no encontrado para ${nombre}`);
      continue;
    }

    const valor = parseFloat(inputEl.value);
    if (isNaN(valor)) {
      console.warn(`Valor inválido para ${nombre}`);
      continue;
    }

    if (nombre.toLowerCase().includes('flexiones')) {
      datosEFM[nombre] = this.calcularNotaFlexiones(valor, grado, genero);
    } else {
      datosEFM[nombre] = valor; // otras pruebas aún sin lógica personalizada
    }
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

    this.notasRegistradas = {};

    for (const prueba of this.pruebasFisicas) {
      const nombre = prueba.nombre;
      this.notasRegistradas[nombre] = datos[nombre] ?? null;
    }
    console.log("Notas físicas obtenidas:", this.notasRegistradas);
    } catch (error) {
      console.error("Error al procesar notas físicas:", error);
      this.notasRegistradas = {};
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

  validarRango(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = parseFloat(input.value);

    if (isNaN(valor) || valor < 0) {
      input.value = '0';
    } else if (valor > 100) {
      input.value = '100';
    }
  }

  debeValidarRango(codigo: string): boolean {
    const excepciones = ['ordenTotal', 'ordenMerito', 'gestionAvanzado'];
    return !excepciones.includes(codigo);
  }


}
