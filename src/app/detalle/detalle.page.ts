import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
}) 
export class DetallePage implements OnInit {

  id: string = "";
  isEditMode: boolean = false;
  producto: Producto = {} as Producto;

  constructor(
    private firestoreService: FirestoreService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido) {
      this.id = idRecibido;
      this.isEditMode = true;
      this.firestoreService.consultarporId('productos-javier', this.id).subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.producto = resultado.payload.data();
        } else {
          this.producto = {} as Producto;
        }
      });
    } else {
      this.isEditMode = false;
      this.producto = {} as Producto;
    }
  }

  guardarProducto() {
    if (this.isEditMode) {
      this.firestoreService.actualizar('productos-javier', this.id, this.producto).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      this.firestoreService.insertar('productos-javier', this.producto).then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Estás seguro de que deseas borrar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Borrar',
          handler: () => {
            this.borrarProducto();
          }
        }
      ]
    });

    await alert.present();
  }

  borrarProducto() {
    this.firestoreService.borrar('productos-javier', this.id).then(() => {
      this.router.navigate(['/home']);
    });
  }
}