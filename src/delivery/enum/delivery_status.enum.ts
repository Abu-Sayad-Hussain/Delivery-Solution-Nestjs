export enum DeliveryState {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  ARRIVED = 'arrived',
  SHIPPED = 'shipped',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  OTP_REQUESTED_BY_HERO = 'otp_requested_by_hero',
  OTP_REQUESTED_BY_MERCHANT = 'otp_requested_by_merchant',
  ADMIN_REQUESTED_BY_HERO = 'admin_requested_by_hero',
  ADMIN_REQUESTED_BY_MERCHANT = 'admin_requested_by_merchant',
  CANCEL_REQUESTED_BY_HERO = 'cancel_requested_by_hero'
}

export enum AssignType {
  SYSTEM = 'system',
  HERO = 'hero',
  ADMIN_ASSIGN = 'admin_assign'
}

export enum CancelNote {
  CN1 = 'Delivery cancelled due to no response in 30 seconds',
  CN2 = 'Bulk Order',
  CN3 = 'Food delivery request cancelled by Admin',
  CN4 = 'Delivery cancelled by Admin',
  CN5 = 'Mistakenly accepted',
  CN6 = 'Food not Available',
  CN7 = 'Out of coverage',
  CN8 = 'Customer wants to Cancel',
  CN9 = 'Customer Unreachable',
  CN10 = 'Customer Wants to Cancel',
  CN11 = 'Customer is Unreachable',
  CN12 = 'Out of delivery coverage / Wrong address given',
  CN13 = 'Delivery cancelled due to no response in 40 seconds',
  CN14 = 'Cannot accept delivery request at this moment',
  CN15 = 'Stock is not available right now',
  CN16 = 'Food is not available',
  CN17 = 'This delivery has been reassigned to another hero by Admin',
  CN18 = 'Cancelled by customer',
  CN19 = 'Please transfer to another hero',
  CN20 = 'Customer unreachable',
  CN21 = 'This order has been passed to another hero',
  CN22 = 'Restaurant Close',
  CN23 = 'This order was picked by someone else',
  CN24 = 'Mistakenly accepted delivery request',
}