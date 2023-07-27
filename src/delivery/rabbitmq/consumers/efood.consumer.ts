import { Injectable } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import {EfoodCommonService} from "../../efood/service/common.service";
import { DeliveryState } from "../../enum/delivery_status.enum";


@Injectable()
export class EfoodConsumer {
  constructor(
    private readonly efoodService: EfoodCommonService,
  ) {
  }

  // event consume for order hero assigned
  @RabbitSubscribe({
    exchange: 'efood.events',
    routingKey: 'efood_order.order.hero_find',
    queue: 'delivery_efood_order_hero_find',
    queueOptions: {
      exclusive: false
    }
  })
  public async efoodHeroAssigned(payload: any) {
    try{
      const deliveryPayload: any = {};
      deliveryPayload.delivery_address = payload.data.address;
      deliveryPayload.shop_slug = payload.data.restaurant_slug;
      deliveryPayload.customer_user_name = payload.data.username;
      deliveryPayload.delivery_hero = payload.data.assigned_to;
      deliveryPayload.delivery_hero['hero_alias'] = payload.data.assigned_to.hero_id;
      delete deliveryPayload.delivery_hero['hero_id'];
      deliveryPayload.delivery_status = payload.data.delivery_status;
      deliveryPayload.delivery_charge = payload.data.delivery_charge;
      deliveryPayload.paid_delivery_charge = payload.data.cod_amount;
      deliveryPayload.purchase_cost = payload.data.subtotal;
      deliveryPayload.total = payload.data.total_amount;
      deliveryPayload.context_type = 'efood';
      deliveryPayload.context_id = payload.data.invoice_no;
      deliveryPayload.assign_by = payload.data.assign_by;
      deliveryPayload.assign_type = payload.data.assign_type;
      deliveryPayload.hero_location = payload.data?.hero_location;
      deliveryPayload.user_location = {
        lat: payload.data?.drop_off_lat,
        lng: payload.data?.drop_off_lon,
      };
      deliveryPayload.merchant_location = {
        lat: payload.data?.restaurant_details?.latitude,
        lng: payload.data?.restaurant_details?.longitude,
      };

      if (payload.data.reassign_reason && payload.data.reassign_reason !== null) {
        deliveryPayload.reassign_reason = payload.data.reassign_reason;
      }
      const createdDelivery = await this.efoodService.create(deliveryPayload);
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
    exchange: 'efood.events',
    routingKey: 'efood_order.delivery.update',
    queue: 'delivery_efood_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async efoodDeliveryUpdate(payload: any) {
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
      const updatedDelivery = await this.efoodService.updateStatusByOrderId(deliveryUpdatePayload);
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
    exchange: 'efood.events',
    routingKey: 'efood_order.delivery.delivered',
    queue: 'delivery_efood_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async efoodDeliveryDelivered(payload: any) {
    const deliveryUpdatePayload: any = {
      context_id: payload.data.invoice_no,
      delivery_status: payload.data.delivery_status,
    };

    console.log(deliveryUpdatePayload, '........................................');
    const updatedDelivery = await this.efoodService.updateStatusByOrderId(deliveryUpdatePayload);
    if (!updatedDelivery){
      console.log('delivery not update');
    }
  }

  // event consume for order delivery canceled
  @RabbitSubscribe({
    exchange: 'efood.events',
    routingKey: 'efood_order.delivery.canceled',
    queue: 'delivery_efood_delivery_update',
    queueOptions: {
      exclusive: false
    }
  })
  public async efoodDeliveryCanceled(payload: any) {
    const deliveryUpdatePayload: any = {
      context_id: payload.data.invoice_no,
      delivery_status: payload.data.delivery_status,
    };

    console.log(deliveryUpdatePayload, '........................................');
    const updatedDelivery = await this.efoodService.updateStatusByOrderId(deliveryUpdatePayload);
    if (!updatedDelivery){
      console.log('delivery not update');
    }
  }

}
