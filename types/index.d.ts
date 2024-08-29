interface OrderType {
    _id: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    shippingAdress: string;
    city: string;
    phone: string;
    totalAmount: number;
    createdAt?: Date; 
    status : string ;
  }
  