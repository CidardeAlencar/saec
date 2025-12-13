import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-information',
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent implements OnInit {
  // variables
  estudiante: any = null;
  nivelSeleccionado: string = '';
  cargandoNotas: boolean = false;
  notasRegistradas: { [codigo: string]: number | null } = {};
  private subscription!: Subscription;
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
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' }
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
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' }
  ];
    materiasPrimerSemestreMilitares = [
    { codigo: 'FOR-FM-01-01', nombre: 'ORDEN CERRADO I', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-01-02', nombre: 'TÉCNICA DE ARMAS', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-01-03', nombre: 'TIRO I', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-01-04', nombre: 'INSTRUCCIÓN TÁCTICA DIURNA', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-01-05', nombre: 'INSTRUCCIÓN TÁCTICA NOCTURNA', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-02-01', nombre: 'REGLAMENTACIÓN', evaluaciones: ['Parcial'] },
    { codigo: 'FOR-FM-02-02', nombre: 'HISTORIA MILITAR', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FM-02-03', nombre: 'GEOGRAFÍA MILITAR', evaluaciones: ['Parcial'] },
  ];

  materiasPrimerSemestreAcademicas = [
    { codigo: 'FOR-FT-01-01', nombre: 'ÁLGEBRA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-01-02', nombre: 'CÁLCULO', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-01-03', nombre: 'FÍSICA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-01-04', nombre: 'TRIGONOMETRÍA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-01-01', nombre: 'LENGUAJE', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-01', nombre: 'INGLÉS I', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] }
  ];

  materiasSegundoSemestreMilitares = [
    { codigo: 'FOR-FM-01-06', nombre: 'ORDEN CERRADO II', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-07', nombre: 'TIRO II', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-08', nombre: 'LECTURA DE CARTAS Y NAVEGACIÓN', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-09', nombre: 'PRIMEROS AUXILIOS', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-10', nombre: 'COMUNICACIONES', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-11', nombre: 'PATRULLAJE I', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-04', nombre: 'TÉCNICA Y CONFECCIÓN DE CALCOS', evaluaciones: ['Parcial 1'] },
  ];

  materiasSegundoSemestreAcademicas = [
    { codigo: 'FOR-FT-02-01', nombre: 'DIBUJO TÉCNICO', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-02-02', nombre: 'TÉCNICA INSTRUMENTAL', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-02-03', nombre: 'CÁLCULO DE COMPENSACIÓN', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-01', nombre: 'TOPOGRAFÍA I', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-02', nombre: 'INGLES II', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-03-01', nombre: 'DERECHOS HUMANOS', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  materiasTercerSemestreMilitares = [
    { codigo: 'FOR-FM-01-12', nombre: 'ORDEN CERRADO III (AMETRALLADORA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-13', nombre: 'SERVICIO DE PIEZA (AMETRALLADORA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-14', nombre: 'TÉCNICA DE ARMAS II (AMETRALLADORA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-15', nombre: 'TIRO II (AMETRALLADORA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-05', nombre: 'TÁCTICA GENERAL', evaluaciones: ['Parcial 1'] },
  ];

  materiasTercerSemestreAcademicas = [
    { codigo: 'FOR-FT-03-02', nombre: 'CARTOGRAFÍA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-03', nombre: 'GEODESIA GEOMÉTRICA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-04', nombre: 'BASE DE DATOS', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-05', nombre: 'TOPOGRAFÍA II', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-03', nombre: 'INGLES III', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-03-02', nombre: 'DERECHO INTERNACIONAL HUMANITARIO', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-04-01', nombre: 'GESTIÓN DE RIESGO DE DESASTRES', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  materiasCuartoSemestreMilitares = [
    { codigo: 'FOR-FM-01-16', nombre: 'PATRULLAJE II', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-06', nombre: 'ADMINISTRACIÓN DE LA INSTRUCCIÓN', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  materiasCuartoSemestreAcademicas = [
    { codigo: 'FOR-FT-03-06', nombre: 'CARTOGRAFÍA DIGITAL', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-07', nombre: 'GEODESIA ESPACIAL', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-08', nombre: 'FOTOGRAMETRÍA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-09', nombre: 'TOPOGRAFÍA VIAL', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-04', nombre: 'INGLES IV', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-03-03', nombre: 'ÉTICA Y LIDERAZGO', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  materiasQuintoSemestreMilitares = [
    { codigo: 'FOR-FM-01-17', nombre: 'CRUCE DE OBSTÁCULOS I', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-18', nombre: 'TÉCNICA DE ARMAS V (PISTOLA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-19', nombre: 'TIRO V (PISTOLA)', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-07', nombre: 'PROCESO DE CONDUCCIÓN DE TROPAS', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-08', nombre: 'MONOGRAFÍAS Y RECONOCIMIENTOS', evaluaciones: ['Parcial 1'] },
  ];

  materiasQuintoSemestreAcademicas = [
    { codigo: 'FOR-FT-03-10', nombre: 'SISTEMA DE INFORMACIÓN GEOGRÁFICA I', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-11', nombre: 'CATASTRO Y AVALÚOS', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-12', nombre: 'TELEDETECCIÓN', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-05', nombre: 'INGLES V', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-07', nombre: 'LENGUA ORIGINARIA I', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-05-01', nombre: 'TITULACIÓN I', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
  ];

  materiasSextoSemestreMilitares = [
    { codigo: 'FOR-FM-01-20', nombre: 'CRUCE DE OBSTÁCULOS II', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-21', nombre: 'TIRO PRÁCTICO', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-01-22', nombre: 'PATRULLAJE III', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-09', nombre: 'TÁCTICA DE INGENIERÍA', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-10', nombre: 'ESTUDIO MILITAR DEL TERRENO', evaluaciones: ['Parcial 1'] },
    { codigo: 'FOR-FM-02-11', nombre: 'TAREAS DE APOYO AL DESARROLLO Y ESTABILIDAD ESTATAL', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  materiasSextoSemestreAcademicas = [
    { codigo: 'FOR-FT-03-13', nombre: 'SISTEMA DE INFORMACIÓN GEOGRÁFICA II', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FT-03-14', nombre: 'GEODESIA FÍSICA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-06', nombre: 'INGLES VI', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-02-08', nombre: 'LENGUA ORIGINARIA II', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-05-02', nombre: 'TITULACIÓN II', evaluaciones: ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-06-01', nombre: 'LEGISLACIÓN TOPOGRÁFICA', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
    { codigo: 'FOR-FC-06-02', nombre: 'LEGISLACIÓN MILITAR', evaluaciones: ['Parcial 1', 'Parcial 2', 'Trabajo Práctico'] },
  ];

  constructor(private estudianteService: EstudianteService) {}

  async ngOnInit(): Promise<void> {
    await this.estudianteService.cargarEstudianteDesdeAuth();
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
  }

  print(){
    window.print();
  }
  async onNivelChange() {
    if (this.estudiante?.id) {
      this.notasRegistradas = {};
      if(this.nivelSeleccionado && this.nivelSeleccionado !== 'avanzado' && this.nivelSeleccionado !== 'basico' ){
        await this.obtenerNotasSemestrales();
        await this.obtenerNotasFisico();
      }else{
        this.obtenerNotas();
      }
    }
  }

  async obtenerNotas() {
    this.cargandoNotas = true;
    try {
      const notas = await this.estudianteService.obtenerNotas(this.estudiante.id, this.nivelSeleccionado);
      this.notasRegistradas = {};
      console.log(notas);
      for (const codigo in notas) {
        this.notasRegistradas[codigo] = notas[codigo]?.nota ?? null;
      }
    } finally {
      this.cargandoNotas = false;
    }
  }

  async obtenerNotasSemestrales() {
    this.cargandoNotas = true;
    try {
      if (!this.estudiante?.id || !this.nivelSeleccionado) return;

      const notas = await this.estudianteService.obtenerNotasSemestrales(
        this.estudiante.id,
        this.nivelSeleccionado
      );

      // this.notasRegistradas = {};

      // 🔹 Convertimos el formato de Firestore a un objeto plano para la UI
      for (const codigo in notas) {
        const materia = notas[codigo];
        for (const key in materia) {
          // ejemplo: "Parcial 1", "Parcial 2", "Nota Final"
          const campoId = `${codigo}-${key}`; // solo si necesitas id único
          this.notasRegistradas[campoId] = materia[key];
        }
      }

      console.log('Notas semestrales cargadas:', this.notasRegistradas);
    } catch (error) {
      console.error('Error al obtener notas semestrales:', error);
    } finally {
      this.cargandoNotas = false;
    }
  }

  async obtenerNotasFisico() {
    this.cargandoNotas = true;

    try {
      if (!this.estudiante?.id || !this.nivelSeleccionado) {
        console.warn("Faltan datos para obtener notas físicas.");
        return;
      }

      const datos = await this.estudianteService.obtenerNotasFisicas(
        this.estudiante.id,
        this.nivelSeleccionado
      );

      console.log(datos);

      // this.notasRegistradas = {};
      // this.cantidadesRegistradas = {};

      for (const prueba of this.pruebasFisicas) {
        const nombre = prueba.nombre;
        this.notasRegistradas[nombre] = datos[nombre] ?? null;
        // this.cantidadesRegistradas[`${nombre}_cant`] = datos[`${nombre}_cant`] ?? null;
      }

      const gestionValor = datos['Gestion'] ?? datos['gestion'] ?? datos['Gesti\u00f3n'] ?? null;
      const gestionNumero = Number(gestionValor);


      console.log("Notas físicas obtenidas:", this.notasRegistradas);
      // console.log("Cantidades físicas obtenidas:", this.cantidadesRegistradas);
    } catch (error) {
      console.error("Error al procesar notas físicas:", error);
      // this.notasRegistradas = {};
      // this.cantidadesRegistradas = {};
      // this.anioSeleccionado = null;
      // this.anioSeleccionadoDate = null;
    } finally {
      this.cargandoNotas = false;
    }
  }

}
