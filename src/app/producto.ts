export interface Producto {
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;
    imagenURL?: string; // Añadir esta línea
}