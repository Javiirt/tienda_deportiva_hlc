import { Component } from '@angular/core';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  productoEditando: Producto ;

  constructor(private firestoreService: FirestoreService) {
    //Crear un producto vacío al empezar
    this.productoEditando ={} as Producto;

  }

  clicBotonInsertar() {
    if (this.productoEditando && Object.keys(this.productoEditando).length > 0) {
      this.firestoreService.insertar('productos', this.productoEditando).then(
        () => {
          console.log('Producto insertado correctamente');
          this.productoEditando = {} as Producto;
        },
        (error) => {
          console.error('Error al insertar producto', error);
        }
      );
    } else {
      console.error('Producto inválido: No se pueden insertar datos vacíos.');
    }
  }
  

}
