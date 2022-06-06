import { Component, OnInit } from '@angular/core';
import { CarritoService} from '../carrito.service';
import { ItemCompra } from '../models/item-compra';
import { URL_BACKEND } from 'src/app/config/config';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Presentacion } from 'src/app/presentacion/presentacion';

@Component({
  selector: 'app-listar-carrito',
  templateUrl: './listar-carrito.component.html',
  styleUrls: ['./listar-carrito.component.css']
})
export class ListarCarritoComponent implements OnInit {

  items: ItemCompra[]
  urlBackend: string = URL_BACKEND

  constructor(public carritoService: CarritoService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    console.log(this.carritoService.items)
  }


  eliminarItemCompra(id: number){
    this.carritoService.eliminarItemCompra(id);
    this._snackBar.open('Has eliminado un producto de tu carrito','',{
      duration: 2500
    });
  }

  comprararPresentacion(o1: Presentacion, o2: Presentacion): boolean{
    if( o1 === undefined && o2 === undefined){
      return true;
    }
    return o1===null || o2===null || o1===undefined || o2===undefined ? false : o1.id===o2.id;

  }

}

