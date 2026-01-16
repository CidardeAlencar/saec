import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export interface ItemBase {
  codigo: string;
  label: string;
  valor: number;
  creadoEn?: string | null;
}

export interface ReporteGeneralParams {
  year: number;   // p.ej. 2026
  scope: string;  // p.ej. 'primerSemestre'
  type:  string;  // p.ej. 'fisico'
}

export interface ReporteGeneralItem {
  ci: string;
  grado?: string | null;
  apMat?: string | null;
  apPat?: string | null;
  nombres?: string | null;
  genero?: string | null;
  edad?: number | null;
  scope: string;
  type: string;
  year: number;
  efm: any; // datos del doc EFM (o el que corresponda)
}

export interface ItemConsejoDoc {
  codigo: string;
  label: string;
  valorCatalogo: number;   // p.ej., -7
  valorConsejo: number;    // decidido en UI
  observacion?: string | null;
  creadoEn?: string | null;
}

export interface NotasDisciplina {
  meritos: ItemBase[];
  demeritos: ItemBase[];
  consejos: ItemConsejoDoc[];
  totalMeritos: number;
  totalDemeritos: number;
  totalConsejo: number;     // suma de valorConsejo
  ultimoMerito?: string | null;
  ultimoDemerito?: string | null;
  ultimoConsejo?: string | null;
}

export interface ReporteDisciplinarioItem {
  ci: string;
  grado?: string | null;
  apMat?: string | null;
  apPat?: string | null;
  nombres?: string | null;
  genero?: string | null;
  scope: string;
  type: 'disciplinario';
  year: number;
  meritos: DiscCategoria;
  demeritos: DiscCategoria;
  consejo: DiscCategoria;
}

export interface DiscCategoria {
  gestion?: number | null;      // la gestion del doc padre si existe
  items: DiscItem[];            // ítems de la subcolección
  totalValor: number;           // suma de 'valor' numérico
}


export interface DiscItem {
  id: string;               // id del doc en 'items' (p.ej. 'MERITO 1')
  codigo?: string | null;
  creadoEn?: string | null; // ISO string si viene así
  label?: string | null;
  valor?: number | null;
  // puedes agregar más campos si los necesitas...
  [k: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudianteData = new BehaviorSubject<any>(null);
  estudianteData$ = this.estudianteData.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {}

  // Buscar en Firestore por CI
  async buscarEstudiantePorCI(ci: string) {
    try {
      const estudianteRef = doc(this.firestore, `estudiante/${ci}`);
      const estudianteSnap = await getDoc(estudianteRef);

      if (estudianteSnap.exists()) {
        const estudiante = estudianteSnap.data();
        console.log("Estudiante encontrado:", estudiante);

        estudiante['id'] = ci; // 📌 Agregar el ID del documento a los datos del estudiante
        console.log("Estudiante encontrado:", estudiante);
        // Guardar datos para compartir entre componentes
        this.estudianteData.next(estudiante);
        return true;
      } else {
        console.log("No se encontró ningún estudiante con ese CI.");
        this.estudianteData.next(null);
        return false;
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
      return false;
    }
  }


  async guardarFirmas(jefe: string, comandante: string, responsable: string) {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      await setDoc(firmaRef, { jefe, comandante, responsable }, { merge: true });
      console.log("Firmas guardadas en Firebase");
      return true;
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      return false;
    }
  }

  async obtenerFirmas() {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      const firmaSnap = await getDoc(firmaRef);

      if (firmaSnap.exists()) {
        const firmas = firmaSnap.data();
        console.log("Firmas obtenidas:", firmas);
        return firmas;
      } else {
        console.log("No se encontraron firmas en Firebase.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener las firmas:", error);
      return null;
    }
  }
  async obtenerNotasFisicas(ci: string, nivel: string): Promise<any> {
  try {
    const ref = doc(this.firestore, `estudiante/${ci}/${nivel}/EFM`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const datos = snap.data();
      console.log("Datos físicos obtenidos:", datos);
      return datos;
    } else {
      console.log("No existen datos físicos en EFM.");
      return {};
    }
  } catch (error) {
    console.error("Error al obtener notas físicas:", error);
    return {};
  }
}

private async leerItemsBase(ci: string, nivel: string, contenedor: 'MERITOS' | 'DEMERITOS'): Promise<ItemBase[]> {
    const path = `estudiante/${ci}/${nivel}/${contenedor}/items`;
    const snap = await getDocs(collection(this.firestore, path));
    return snap.docs.map(d => {
      const data: any = d.data();
      return {
        codigo: data.codigo ?? '',
        label: data.label ?? '',
        valor: Number(data.valor) || 0,
        creadoEn: data.creadoEn ?? null,
      } as ItemBase;
    });
  }

  /** Lee items de CONSEJO: estudiante/{ci}/{nivel}/CONSEJO/items */
  private async leerItemsConsejo(ci: string, nivel: string): Promise<ItemConsejoDoc[]> {
    const path = `estudiante/${ci}/${nivel}/CONSEJO/items`;
    const snap = await getDocs(collection(this.firestore, path));
    return snap.docs.map(d => {
      const data: any = d.data();
      return {
        codigo: data.codigo ?? '',
        label: data.label ?? '',
        valorCatalogo: Number(data.valorCatalogo) || 0,
        valorConsejo: Number(data.valorConsejo) || 0,
        observacion: data.observacion ?? null,
        creadoEn: data.creadoEn ?? null,
      } as ItemConsejoDoc;
    });
  }

  /** Toma el último por fecha ISO (desc), si no hay fecha usa orden por código (desc) */
  private tomarUltimoCodigo<T extends { codigo: string; creadoEn?: string | null }>(arr: T[]): string | null {
    if (!arr.length) return null;
    const conFecha = arr.filter(a => !!a.creadoEn);
    if (conFecha.length) {
      const last = conFecha.sort((a, b) => (a.creadoEn! < b.creadoEn! ? 1 : -1))[0];
      return last.codigo;
    }
    return arr.sort((a, b) => (a.codigo < b.codigo ? 1 : -1))[0].codigo;
  }

  /** Suma segura de un campo numérico */
  private sum<T>(arr: T[], getter: (x: T) => number): number {
    return arr.reduce((acc, it) => acc + (Number(getter(it)) || 0), 0);
  }

  /** API pública: obtener todo Disciplina */
  async obtenerNotasDisciplina(ci: string, nivel: string): Promise<NotasDisciplina> {
    try {
      const [meritos, demeritos, consejos] = await Promise.all([
        this.leerItemsBase(ci, nivel, 'MERITOS'),
        this.leerItemsBase(ci, nivel, 'DEMERITOS'),
        this.leerItemsConsejo(ci, nivel),
      ]);

      const totalMeritos   = this.sum(meritos,   x => x.valor);
      const totalDemeritos = this.sum(demeritos, x => x.valor);
      const totalConsejo   = this.sum(consejos,  x => x.valorConsejo);

      return {
        meritos,
        demeritos,
        consejos,
        totalMeritos,
        totalDemeritos,
        totalConsejo,
        ultimoMerito:   this.tomarUltimoCodigo(meritos),
        ultimoDemerito: this.tomarUltimoCodigo(demeritos),
        ultimoConsejo:  this.tomarUltimoCodigo(consejos),
      };
    } catch (error) {
      console.error('Error al obtener notas de disciplina:', error);
      // Devuelve estructura vacía para evitar null checks en el componente
      return {
        meritos: [],
        demeritos: [],
        consejos: [],
        totalMeritos: 0,
        totalDemeritos: 0,
        totalConsejo: 0,
        ultimoMerito: null,
        ultimoDemerito: null,
        ultimoConsejo: null,
      };
    }
  }

  async obtenerNotas(ci: string, nivel: string) {
    try {
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
          'TEC-TOV-01-06'
        ],
        avanzado: [
          'BAS-ASI-01-02',
          'BAS-ASO-01-03',
          'BAS-ASP-01-01',
          'BAS-PICB-01-07',
          'COM-CPM-01-01',
          'EJT-AEM-01-01',
          'PFD-EFM-01-01',
          'TEC-BDG-01-06',
          'TEC-CTE-01-09',
          'TEC-GPR-01-04',
          'TEC-SCT-01-08',
          'TEC-TIN-01-07'
        ]
      };

      const codigosMaterias = codigosPorNivel[nivel] || [];

      const notas: any = {};

      // Obtener datos de todas las materias
      for (const codigo of codigosMaterias) {
        const materiaRef = doc(this.firestore, `estudiante/${ci}/${nivel}/${codigo}`);
        const materiaSnap = await getDoc(materiaRef);
        console.log(`[${nivel}] Leyendo materia: ${codigo}`, materiaSnap.exists());
        if (materiaSnap.exists()) {
          notas[codigo] = {
            nota: materiaSnap.data()?.['nota1'] ?? null,
            nombre: materiaSnap.data()?.['nombre'] ?? ''
          };
        } else {
          notas[codigo] = { nota: null, nombre: '' };
        }
      }

      // Notas adicionales
      // const finalPrimeroSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/finalPrimero`));
      // const finalSegundoSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/finalSegundo`));
      const ordenMeritoSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/ordenMerito`));
      const promedioFisicoSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/promedioFisico`));
      const promedioDisciplinaSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/promedioDisciplina`));
      // const ordenTotalSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/ordenMerito`));
      const gestionAvanzadoSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/gestionAvanzado`));
      const gestionBasicoSnap = await getDoc(doc(this.firestore, `estudiante/${ci}/${nivel}/gestionBasico`));
      // notas.notaPrimero = finalPrimeroSnap.exists() ? finalPrimeroSnap.data()?.['nota'] ?? null : null;
      // notas.notaSegundo = finalSegundoSnap.exists() ? finalSegundoSnap.data()?.['nota'] ?? null : null;
      notas.ordenMerito = ordenMeritoSnap.exists() ? ordenMeritoSnap.data()?.['orden'] ?? null : null;
      notas.ordenTotal = ordenMeritoSnap.exists() ? ordenMeritoSnap.data()?.['total'] ?? null : null;
      notas.promedioFisico = promedioFisicoSnap.exists() ? promedioFisicoSnap.data()?.['nota1'] ?? null : null;
      notas.promedioDisciplina = promedioDisciplinaSnap.exists() ? promedioDisciplinaSnap.data()?.['nota1'] ?? null : null;
      notas.gestionAvanzado = gestionAvanzadoSnap.exists() ? gestionAvanzadoSnap.data()?.['gestion'] ?? null : null;
      notas.gestionBasico = gestionBasicoSnap.exists() ? gestionBasicoSnap.data()?.['gestion'] ?? null : null;
      console.log("Notas:", notas);
      return notas;

    } catch (error) {
      console.error("Error al obtener las notas:", error);
      return {};
    }
  }

  async registrarEstudiante(ci: string, data: any) {
    try {
      const estudianteRef = doc(this.firestore, `estudiante/${ci}`);
      await setDoc(estudianteRef, data, { merge: true });
      console.log('Estudiante registrado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      return false;
    }
  }

  async cargarEstudianteDesdeAuth() {
    const user = await this.auth.currentUser;

    if (!user) {
      console.warn('No hay usuario autenticado');
      return;
    }

    const estudiantesRef = collection(this.firestore, 'estudiante');
    const q = query(estudiantesRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const estudiante = docSnap.data();
      estudiante['id'] = docSnap.id; // el CI
      this.estudianteData.next(estudiante);
    } else {
      console.warn('No se encontró un estudiante con este UID');
      this.estudianteData.next(null);
    }
  }

  // async obtenerDatosGenrales(params: ReporteGeneralParams): Promise<Array<{
  //   ci: string;
  //   grado?: string | null;
  //   apMat?: string | null;
  //   apPat?: string | null;
  //   nombres?: string | null;
  //   genero?: string | null;
  //   scope: string;
  //   type: string;
  //   year: number;
  //   efm: any;             // datos del doc (EFM u otro)
  // }>> {
  //   const { year, scope, type } = params;

  //   // 1) Colección raíz de estudiantes
  //   const estudiantesCol = collection(this.firestore, 'estudiante');
  //   const estudiantesSnap = await getDocs(estudiantesCol);

  //   // 2) Mapeo de tipo → nombre del documento
  //   const docType = this.mapTypeToDoc(type); // 'fisico' -> 'EFM', etc.

  //   const resultados: Array<{
  //     ci: string;
  //     grado: string;
  //     apMat: string;
  //     apPat: string;
  //     nombres: string;
  //     genero: string;
  //     scope: string;
  //     type: string;
  //     year: number;
  //     efm: any;
  //   }> = [];

  //   // 3) Iterar todos los estudiantes
  //   const tareas = estudiantesSnap.docs.map(async (estuDoc) => {
  //     const ci = estuDoc.id;
  //     const estuData = estuDoc.data() as any;
  //     console.log(estuData)
  //     const grado   = estuData?.grado   ?? null;
  //     const apMat   = estuData?.apMat   ?? null;
  //     const apPat   = estuData?.apPat   ?? null;
  //     const nombres = estuData?.nombres ?? null;
  //     const genero  = estuData?.genero  ?? null;

  //     // Ruta: estudiante/{ci}/{scope}/{docType}
  //     const ref = doc(this.firestore, `estudiante/${ci}/${scope}/${docType}`);
  //     const snap = await getDoc(ref);

  //     if (!snap.exists()) return;

  //     const data = snap.data() as any;

  //     // Robustez: Gestion puede venir con may/min y como string/number
  //     const gestionRaw = data?.Gestion ?? data?.gestion ?? data?.Gesti\u00f3n;
  //     const gestionNum = Number(gestionRaw);

  //     if (!Number.isFinite(gestionNum)) return;

  //     if (gestionNum === Number(year)) {
  //       resultados.push({
  //         ci,
  //         grado,
  //         apMat,
  //         apPat,
  //         nombres,
  //         genero,
  //         scope,
  //         type,
  //         year,
  //         efm: data,
  //       });
  //     }
  //   });
  async obtenerDatosGenrales(params: ReporteGeneralParams): Promise<ReporteGeneralItem[]> {
    const { year, scope, type } = params;

    // 1) Colección raíz de estudiantes
    const estudiantesCol = collection(this.firestore, 'estudiante');
    const estudiantesSnap = await getDocs(estudiantesCol);

    // 2) Mapeo de tipo → nombre del documento
    const docType = this.mapTypeToDoc(type); // 'fisico' -> 'EFM', etc.

    const resultados: ReporteGeneralItem[] = [];

    // 3) Iterar todos los estudiantes
    const tareas = estudiantesSnap.docs.map(async (estuDoc) => {
      const ci = estuDoc.id;
      const estuData = estuDoc.data() as any;
      console.log(estuData)
      const grado   = estuData?.grado   ?? null;
      const apMat   = estuData?.apMat   ?? null;
      const apPat   = estuData?.apPat   ?? null;
      const nombres = estuData?.nombres ?? null;
      const genero  = estuData?.genero  ?? null;
      const edad    = this.calcularEdad(estuData?.fechaNacimiento ?? null);

      // Ruta: estudiante/{ci}/{scope}/{docType}
      const ref = doc(this.firestore, `estudiante/${ci}/${scope}/${docType}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data() as any;

      // Robustez: Gestion puede venir con may/min y como string/number
      const gestionRaw = data?.Gestion ?? data?.gestion ?? data?.Gesti\u00f3n;
      const gestionNum = Number(gestionRaw);

      if (!Number.isFinite(gestionNum)) return;

      if (gestionNum === Number(year)) {
        resultados.push({
          ci,
          grado,
          apMat,
          apPat,
          nombres,
          genero,
          edad,
          scope,
          type,
          year,
          efm: data,
        });
      }
    });

    await Promise.all(tareas);
    return resultados;
  }
  
  calcularEdad(fechaNacimiento: unknown): number | null {
    if (!fechaNacimiento) {
      return null;
    }

    let fecha: Date | null = null;

    if (fechaNacimiento instanceof Date) {
      fecha = fechaNacimiento;
    } else if (typeof fechaNacimiento === 'string') {
      const parsed = new Date(fechaNacimiento);
      if (!Number.isNaN(parsed.getTime())) {
        fecha = parsed;
      }
    } else if (typeof fechaNacimiento === 'object') {
      const maybeTimestamp = fechaNacimiento as { toDate?: () => Date; seconds?: number; nanoseconds?: number };
      if (maybeTimestamp?.toDate) {
        fecha = maybeTimestamp.toDate();
      } else if (typeof maybeTimestamp?.seconds === 'number') {
        fecha = new Date(maybeTimestamp.seconds * 1000);
      }
    }

    if (!fecha) {
      return null;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    return edad >= 0 ? edad : null;
  }

   async obtenerDatosGenralesD(params: ReporteGeneralParams): Promise<ReporteDisciplinarioItem[]> {
    const { year, scope } = params;
    const yearNum = Number(year);
    if (!Number.isFinite(yearNum)) return [];

    // 1) Leer todos los estudiantes
    const estudiantesCol = collection(this.firestore, 'estudiante');
    const estudiantesSnap = await getDocs(estudiantesCol);

    const resultados: ReporteDisciplinarioItem[] = [];

    // 2) Iterar estudiantes
    const tareas = estudiantesSnap.docs.map(async (estuDoc) => {
      const ci = estuDoc.id;
      const estuData = estuDoc.data() as any;

      const grado   = estuData?.grado   ?? null;
      const apMat   = estuData?.apMat   ?? null;
      const apPat   = estuData?.apPat   ?? null;
      const nombres = estuData?.nombres ?? null;
      const genero  = estuData?.genero  ?? null;

      // 3) Cargar categorías (MERITOS, DEMERITOS, CONSEJO)
      const [meritos, demeritos, consejo] = await Promise.all([
        this._leerCategoriaDisc(ci, scope, 'MERITOS', yearNum),
        this._leerCategoriaDisc(ci, scope, 'DEMERITOS', yearNum),
        this._leerCategoriaDisc(ci, scope, 'CONSEJO', yearNum),
      ]);

      // Si ninguna categoría coincide con la gestión pedida, omitir
      const hayAlgo =
        (meritos.items.length > 0) ||
        (demeritos.items.length > 0) ||
        (consejo.items.length > 0);

      if (!hayAlgo) return;

      resultados.push({
        ci,
        grado,
        apMat,
        apPat,
        nombres,
        genero,
        scope,
        type: 'disciplinario',
        year: yearNum,
        meritos,
        demeritos,
        consejo,
      });
    });

    await Promise.all(tareas);
    return resultados;
  }

  /**
   * Lee una categoría disciplinaria:
   *   estudiante/{ci}/{scope}/{categoria} (DOC padre con campo Gestion)
   *   └── items (SUBCOLECCIÓN con N documentos: MERITO 1, MERITO 2, ...)
   * Si el doc padre no existe o su 'Gestion' != year, retorna vacío.
   */
  private async _leerCategoriaDisc(
    ci: string,
    scope: string,
    categoria: 'MERITOS' | 'DEMERITOS' | 'CONSEJO',
    yearNum: number
  ): Promise<DiscCategoria> {
    // Doc padre
    const catRef = doc(this.firestore, `estudiante/${ci}/${scope}/${categoria}`);
    const catSnap = await getDoc(catRef);
    if (!catSnap.exists()) {
      return { gestion: null, items: [], totalValor: 0 };
    }

    const catData = catSnap.data() as any;
    const gestionRaw =
      catData?.Gestion ?? catData?.gestion ?? catData?.Gesti\u00f3n ?? catData?.gestión;
    const gestionNum = Number(gestionRaw);

    // Si el doc padre no tiene Gestión o no coincide, no traemos items
    if (!Number.isFinite(gestionNum) || gestionNum !== yearNum) {
      return { gestion: Number.isFinite(gestionNum) ? gestionNum : null, items: [], totalValor: 0 };
    }

    // Subcolección 'items'
    const itemsCol = collection(catRef, 'items');
    const itemsSnap = await getDocs(itemsCol);

    const items: DiscItem[] = itemsSnap.docs.map((d) => {
      const data = d.data() as any;
      const valorNum = Number(data?.valor);
      return {
        id: d.id,
        codigo: data?.codigo ?? null,
        creadoEn: data?.creadoEn ?? null,
        label: data?.label ?? null,
        valor: Number.isFinite(valorNum) ? valorNum : (data?.valor ?? null),
        ...data, // conserva otros campos que puedan existir
      };
    });

    // Orden (opcional): por creadoEn ascendente si existe
    items.sort((a, b) => (a.creadoEn ?? '').localeCompare(b.creadoEn ?? ''));

    // Total valor numérico
    const totalValor = items.reduce((acc, it) => {
        if (typeof it.valor === 'number') {
          return acc + it.valor;
        } else if (typeof it['valorConsejo'] === 'number') {
          return acc + it['valorConsejo'];
        } else {
          return acc;
        }
      }, 0);

    return { gestion: gestionNum, items, totalValor };
  }

  /** Mapea el 'type' de UI al nombre real del documento en Firestore */
  private mapTypeToDoc(type: string): string {
    switch ((type || '').toLowerCase()) {
      case 'fisico':
        return 'EFM';          // ← tu caso conocido
      // case 'digital': return 'EDIG';   // <- ejemplo si más adelante hay otro doc
      // case 'consolidado': return 'ECON'; // <- ejemplo
      default:
        // fallback: si quisieras derivar por convención
        return (type || 'EFM').toUpperCase();
    }
  }

}
