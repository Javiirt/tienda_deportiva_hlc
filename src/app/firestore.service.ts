import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) {}

  public insertar(coleccion: string, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion: string) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public consultarporId(coleccion: string, documentId: string) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public actualizar(coleccion: string, documentId: string, datos: any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).update(datos);
  }

  public borrar(coleccion: string, documentId: string) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }
}