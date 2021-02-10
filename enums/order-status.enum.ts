export enum OrderStatus {
  PENDING    = "pending",
  PACKED     = "packed",
  ON_THE_WAY = "on the way",
  DELIVERED  = "delivered",
  CANCELLED  = "cancelled",
  REJECTED   = "rejected",
  INCOMPLETE = "incomplete"
}

export enum PickupStatus {
  PENDING   = "pending",
  SUCCESS   = "success",
  CANCELLED = "cancelled",
}
