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


  async guardarFirmas(jefe: string, comandante: string) {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      await setDoc(firmaRef, { jefe, comandante }, { merge: true });
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



}
