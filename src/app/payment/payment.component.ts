import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import {
  StripeElementsOptions,
  PaymentIntent,
  Appearance
} from '@stripe/stripe-js';
import { PaymentService } from '../services/stripe.service';
import { CarritoService } from '../compras/carrito.service';
import { ComprasService } from '../compras/services/compras.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Compra } from '../compras/models/compra';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  paymentElementForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [ this.amount*100, [Validators.required, Validators.pattern(/\d+/)]]
  });

  appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#16a2ff',
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;

  compra: Compra

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private carritoService: CarritoService,
    private comprasService: ComprasService,
    private router: Router,
    public dialogRef: MatDialogRef<PaymentComponent>
  ) {}

  get amount(): number{
    return this.carritoService.calcularGranTotal() ;
  }

  ngOnInit() {

    const paymentIntentDto: any = {
      amount: this.amount*100,
      currency: 'pen',
      description: "compras varias en etruegame"
    };

    this.paymentService.pagar(paymentIntentDto).subscribe(
      (response:any) =>{
        console.log('payment service',response)
        this.elementsOptions.clientSecret = response.client_secret
      }
    )

    this.compra = this.carritoService.compra
  }

  pay() {
    if (this.paymentElementForm.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${this.paymentElementForm.get('name').value} ${this.paymentElementForm.get('apellido').value}`,
              email: this.paymentElementForm.get('email').value,
              address: {
                line1: this.paymentElementForm.get('address').value || '',
                postal_code: this.paymentElementForm.get('zipcode').value || '',
                city: this.paymentElementForm.get('city').value || '',
              }
            }
          }
        },
        redirect: 'if_required'
      }).subscribe( (result:any) => {
        this.paying = false;
        console.log('Result', result);

        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          Swal.fire('Error','error: ' + result.error.message, 'error')
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            console.log("id: " ,result.paymentIntent.id)

            this.comprasService.create(this.compra).subscribe(
              compra =>{
                this.dialogRef.close();
                Swal.fire('Listo','se ha confirmado la compra con el id ' + result.paymentIntent.id, 'success')
                console.log('compra ->', compra )
                this.carritoService.carNew();
                this.router.navigate(['/productos']);
            })
          }
        }
      });
    } else {
      console.log(this.paymentElementForm);
    }
  }

  cerrarModal(){
    this.dialogRef.close();
  }
}

