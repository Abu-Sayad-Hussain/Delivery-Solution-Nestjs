import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AssignType, DeliveryState, CancelNote } from "../enum/delivery_status.enum";

export type DeliveryDocument = Delivery & Document;

@Schema()
class LatLng {
  @Prop()
  lat: number;

  @Prop()
  lng: number
}

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Delivery {
  @Prop()
  delivery_id: string;

  @Prop({ default: DeliveryState.PENDING })
  delivery_status: DeliveryState;

  @Prop()
  delivery_address: string;

  @Prop()
  assign_type: AssignType;

  @Prop({ type: Object })
  assign_by: Object;

  @Prop()
  shop_slug: string;

  @Prop()
  customer_user_name: string;

  @Prop()
  delivery_hero_alias: string;

  @Prop({ type: Object })
  delivery_hero: Object;

  @Prop()
  delivery_charge: number;

  @Prop()
  paid_delivery_charge: number;

  @Prop()
  purchase_cost: number;

  @Prop()
  total: number;

  @Prop()
  delivery_start_time: Date;

  @Prop()
  delivery_end_time: Date;

  @Prop()
  cancel_note: CancelNote;

  @Prop()
  context_type: string;

  @Prop()
  context_id: string;

  @Prop({ type: Object })
  hero_location: Object;

  @Prop({ type: LatLng })
  user_location: Object;

  @Prop({ type: LatLng })
  merchant_location: Object;

  @Prop({ type: { code: Number, expires_at: Date, retry_expires_at: Date, count: Number } })
  confirmation_proof: Object;

  @Prop()
  confirmed_at: Date;

  @Prop()
  confirmed: boolean;

  @Prop()
  confirmed_by: string;

  @Prop()
  reassign_reason: string;

  @Prop()
  updated_by: string;

  @Prop({ type: Object })
  meta: Object;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

DeliverySchema.pre('save', function() {
  if (this.get('delivery_status') === 'assigned') {
    this.set({ delivery_start_time: new Date() });
  }
});
DeliverySchema.post('findOneAndUpdate', async (result) => {
  if (result.delivery_status === 'assigned') {
    await result.save();
  }
});
DeliverySchema.post('findOneAndUpdate', async (result) => {
  if (result.delivery_status === 'delivered') {
    result.set({ delivery_end_time: new Date() });
    await result.save();
  }
});
