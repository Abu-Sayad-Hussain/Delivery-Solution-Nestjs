import { Injectable } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import {ExpressCommonService} from "../../express/service/common.service";
import { DeliveryState } from "../../enum/delivery_status.enum";


@Injectable()
export class ExpressConsumer {
  constructor(
    private readonly expressService: ExpressCommonService,
  ) {
  }

  // event consume for order hero assigned
  @RabbitSubscribe({
    exchange: 'express.events',
    routingKey: 'express.hero.assigned',
    queue: 'delivery_express_hero_assigned',
    queueOptions: {
      exclusive: false
    }
  })
  public async efoodHeroAssigned(payload: any) {
    try{
      const deliveryPayload: any = {
        delivery_address: payload.data.customer_address,
        shop_slug: payload.data.shop_slug,
        customer_user_name: payload.data.customer?.username,
        delivery_hero: payload.data.delivery_hero_details,
        delivery_status: payload.data.delivery_status,
        delivery_charge: payload.data.delivery_charge,
        paid_delivery_charge: payload.data.paid_delivery_charge,
        purchase_cost: payload.data.subtotal,
        total: payload.data.total,
        context_type: 'express',
        context_id: payload.data.invoice_no,
        assign_by: payload.data.assign_by,
        assign_type: payload.data.assign_type,
        hero_location: payload.data?.hero_location,
        user_location: payload.data?.user_location,
        merchant_location: {
          lat: payload.data.shop_details?.latitude,
          lng: payload.data.shop_details?.longitude,
        },
      };

      if (payload.data.reassign_reason && payload.data.reassign_reason !== null) {
        deliveryPayload.reassign_reason = payload.data.reassign_reason;
      }
      const createdDelivery = await this.expressService.create(deliveryPayload);
      if (!createdDelivery){
        console.log('delivery not create');
      }
    }
    catch (e) {
      console.log(e.message);
    }
  }

  // event consume for delivery update
  @RabbitSubscribe({
    exchange: 'express.events',
    routingKey: 'express.delivery.update',
    queue: 'delivery_express_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async expressDeliveryUpdate(payload: any) {
    try {
      const deliveryUpdatePayload: any = {
        context_id: payload.data.invoice_no,
        delivery_status: payload.data.delivery_status,
      };
      // ARRIVED and PICKED_UP......................................
      if (
        [DeliveryState.ARRIVED, DeliveryState.PICKED_UP].includes(
          payload.data.delivery_status,
        )
      ) {
        deliveryUpdatePayload.hero_location = payload.data.hero_location;
      }
      // OTP_REQUESTED_BY_HERO......................................
      if (payload.data.delivery_status === DeliveryState.OTP_REQUESTED_BY_HERO) {
        deliveryUpdatePayload.hero_location = payload.data.hero_location;
        deliveryUpdatePayload.confirmation_proof = {
          code: payload.data.meta?.confirmation_code,
          expires_at: payload.data.meta?.expires_at,
        };
      }
      console.log(deliveryUpdatePayload, '........................................');
      const updatedDelivery = await this.expressService.updateStatusByOrderId(deliveryUpdatePayload);
      if (!updatedDelivery){
        console.log('delivery not update');
      }
    }
    catch (e) {
      console.log(e.message);
    }
  }

  // event consume for order delivery delivered
  @RabbitSubscribe({
    exchange: 'express.events',
    routingKey: 'express.delivery.delivered',
    queue: 'delivery_express_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async expressDeliveryDelivered(payload: any) {
    const deliveryUpdatePayload: any = {
      context_id: payload.data.invoice_no,
      delivery_status: payload.data.delivery_status,
    };

    console.log(deliveryUpdatePayload, '........................................');
    const updatedDelivery = await this.expressService.updateStatusByOrderId(deliveryUpdatePayload);
    if (!updatedDelivery){
      console.log('delivery not update');
    }
  }

  // event consume for order delivery canceled
  @RabbitSubscribe({
    exchange: 'express.events',
    routingKey: 'express.delivery.canceled',
    queue: 'delivery_express_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async expressDeliveryCanceled(payload: any) {
    const deliveryUpdatePayload: any = {
      context_id: payload.data.invoice_no,
      delivery_status: payload.data.delivery_status,
    };

    console.log(deliveryUpdatePayload, '........................................');
    const updatedDelivery = await this.expressService.updateStatusByOrderId(deliveryUpdatePayload);
    if (!updatedDelivery){
      console.log('delivery not update');
    }
  }

}
