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
