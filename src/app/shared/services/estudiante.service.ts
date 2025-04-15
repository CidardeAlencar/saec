import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudianteData = new BehaviorSubject<any>(null);
  estudianteData$ = this.estudianteData.asObservable();

  constructor(private firestore: Firestore) {}

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

  async obtenerNotas(ci: string, nivel: string) {
    // try {
    //   const codigosMaterias = [
    //   'BAS-CMI-01-02',
    //   'BAS-DCO-01-04',
    //   'BAS-DOU-01-07',
    //   'BAS-EFM-01-01',
    //   'BAS-EST-01-05',
    //   'BAS-PLA-01-06',
    //   'BAS-RMI-01-01',
    //   'COM-GEN-01-03',
    //   'COM-LID-01-02',
    //   'PROY-I-II',
    //   'TEC-GAE-01-02',
    //   'TEC-MDT-01-04',
    //   'TEC-PRS-01-05',
    //   'TEC-RGE-01-03',
    //   'TEC-TOA-01-01',
    //   'TEC-TOV-01-06'
    // ];
    //   const BASCMI0102Ref = doc(this.firestore, `estudiante/${ci}/${nivel}/BAS-CMI-01-02`);
    //   const BASCMI0102Snap = await getDoc(BASCMI0102Ref);

    //   const BASDCO0104Ref = doc(this.firestore, `estudiante/${ci}/${nivel}/BAS-DCO-01-04`);
    //   const BASDCO0104Snap = await getDoc(BASDCO0104Ref);
      
    //   const finalPrimeroRef = doc(this.firestore, `estudiante/${ci}/${nivel}/finalPrimero`);
    //   const notaPrimeroSnap = await getDoc(finalPrimeroRef);

    //   const finalSegundoRef = doc(this.firestore, `estudiante/${ci}/${nivel}/finalSegundo`);
    //   const notaSegundoSnap = await getDoc(finalSegundoRef);

    //   const ordenMeritoRef = doc(this.firestore, `estudiante/${ci}/${nivel}/ordenMerito`);
    //   const ordenMeritoSnap = await getDoc(ordenMeritoRef);

    //   let notas = {
    //     BASCMI0102: null,
    //     BASCMI0102name: null,
    //     BASDCO0104: null,
    //     BASDCO0104name: null,
    //     notaPrimero: null,
    //     notaSegundo: null,
    //     ordenMerito: null
    //   };

    //   BASDCO0104Snap

    //   if(BASDCO0104Snap.exists()){
    //     notas.BASDCO0104 = BASDCO0104Snap.data()?.['nota1'];
    //     notas.BASDCO0104name = BASDCO0104Snap.data()?.['nombre'];
    //   }

    //   if(BASCMI0102Snap.exists()){
    //     notas.BASCMI0102 = BASCMI0102Snap.data()?.['nota1'];
    //     notas.BASCMI0102name = BASCMI0102Snap.data()?.['nombre'];
    //   }

    //   if (notaPrimeroSnap.exists()) {
    //     notas.notaPrimero = notaPrimeroSnap.data()?.['nota'];
    //   }

    //   if (notaSegundoSnap.exists()) {
    //     notas.notaSegundo = notaSegundoSnap.data()?.['nota'];
    //   }

    //   if (ordenMeritoSnap.exists()) {
    //     notas.ordenMerito = ordenMeritoSnap.data()?.['orden'];
    //   }

    //   console.log(`Notas obtenidas para nivel ${nivel}:`, notas);
    //   return notas;

    // } catch (error) {
    //   console.error("Error al obtener las notas:", error);
    //   return { notaPrimero: null, notaSegundo: null, ordenMerito: null, BASCMI0102: null, BASCMI0102name: null, BASDCO0104:null, BASDCO0104name:null };
    // }
    try {
      const codigosMaterias = [
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
      ];
  
      const notas: any = {};
  
      // Obtener datos de todas las materias
      for (const codigo of codigosMaterias) {
        const materiaRef = doc(this.firestore, `estudiante/${ci}/${nivel}/${codigo}`);
        const materiaSnap = await getDoc(materiaRef);
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
  
      // notas.notaPrimero = finalPrimeroSnap.exists() ? finalPrimeroSnap.data()?.['nota'] ?? null : null;
      // notas.notaSegundo = finalSegundoSnap.exists() ? finalSegundoSnap.data()?.['nota'] ?? null : null;
      notas.ordenMerito = ordenMeritoSnap.exists() ? ordenMeritoSnap.data()?.['orden'] ?? null : null;
      notas.ordenTotal = ordenMeritoSnap.exists() ? ordenMeritoSnap.data()?.['total'] ?? null : null;
      notas.promedioFisico = promedioFisicoSnap.exists() ? promedioFisicoSnap.data()?.['nota1'] ?? null : null;
      notas.promedioDisciplina = promedioDisciplinaSnap.exists() ? promedioDisciplinaSnap.data()?.['nota1'] ?? null : null;
  
      console.log("Notas:", notas);
      return notas;
  
    } catch (error) {
      console.error("Error al obtener las notas:", error);
      return {};
    }
}


}
