import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { TranslationService } from '../../services/translation.service';
import { CartItem } from '../../models/cart-item.model';
import { CustomerDetails } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  customerDetails: CustomerDetails = {
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    paymentMethod: 'CREDIT_CARD',
    shippingMethod: 'STANDARD',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    savePaymentInfo: false
  };
  
  paymentMethods = [
    { id: 'CREDIT_CARD', name: this.translationService.translate('checkout.credit_card') },
    { id: 'COD', name: this.translationService.translate('checkout.cod') }
  ];
  
  shippingMethods = [
    { id: 'STANDARD', name: this.translationService.translate('checkout.standard_delivery'), fee: 4.99, freeOver: 50 },
    { id: 'EXPRESS', name: this.translationService.translate('checkout.express_delivery'), fee: 9.99, freeOver: null }
  ];
  
  currentStep = 1;
  totalSteps = 3;
  shippingFee = 4.99;
  placing = false;
  orderPlaced = false;
  placedOrder: any = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadCartItems();
    this.updateShippingFee();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    this.updateShippingFee();
  }
  
  updateShippingFee() {
    const selectedMethod = this.shippingMethods.find(m => m.id === this.customerDetails.shippingMethod);
    if (selectedMethod) {
      if (selectedMethod.freeOver && this.cartTotal >= selectedMethod.freeOver) {
        this.shippingFee = 0;
      } else {
        this.shippingFee = selectedMethod.fee;
      }
    }
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  onShippingMethodChange() {
    this.updateShippingFee();
  }
  
  isCustomerInfoValid(): boolean {
    // Check if all required customer info fields are filled and valid
    return !!this.customerDetails.customerName && 
           !!this.customerDetails.customerPhone && 
           !!this.customerDetails.customerEmail && 
           !!this.customerDetails.customerAddress;
  }
  
  isPaymentStepInvalid(): boolean {
    // Only validate credit card fields if credit card payment is selected
    if (this.customerDetails.paymentMethod === 'CREDIT_CARD') {
      return !this.customerDetails.cardNumber || 
             !this.customerDetails.cardExpiry || 
             !this.customerDetails.cardCvv;
    }
    return false; // Other payment methods don't need validation
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      return;
    }

    this.placing = true;
    
    // Remove sensitive card details before sending to server if not saving payment info
    const orderDetails = {...this.customerDetails};
    if (!orderDetails.savePaymentInfo) {
      delete orderDetails.cardNumber;
      delete orderDetails.cardExpiry;
      delete orderDetails.cardCvv;
      delete orderDetails.savePaymentInfo;
    }
    
    this.orderService.placeOrder(orderDetails).subscribe({
      next: (order) => {
        this.placedOrder = order;
        this.orderPlaced = true;
        this.placing = false;
        
        // Force reload cart items to ensure cart count is reset
        this.cartService.loadCartItems();
        
        // Clear local cart items array
        this.cartItems = [];
        
        // Reset form
        this.customerDetails = {
          customerName: '',
          customerAddress: '',
          customerPhone: '',
          customerEmail: '',
          paymentMethod: 'CREDIT_CARD',
          shippingMethod: 'STANDARD',
          cardNumber: '',
          cardExpiry: '',
          cardCvv: '',
          savePaymentInfo: false
        };
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.placing = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  viewOrder() {
    if (this.placedOrder) {
      this.router.navigate(['/orders', this.placedOrder.id]);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
