// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
// import {
//   Injectable,
// } from '@nestjs/common';
// import { ApiCall } from 'src/orders/helpers/apiCall.helper';
// import { DeliveryState } from '../../enum/delivery_status.enum';
//
// @Injectable()
// export class Publisher {
//   constructor(
//     private readonly amqpConnection: AmqpConnection,
//     private readonly apiCall: ApiCall,
//   ) {}
//
//   // event publish for order create
//   async expressOrderCreate(payload: any): Promise<void> {
//     try {
//       await this.amqpConnection.publish(
//         'express.events',
//         'express.order.create',
//         {
//           data: payload,
//         },
//       );
//     } catch (error) {
//       // Api call to hero for hero order ack
//       const heroPayload: any = {
//         zone_alias: payload.zone_alias,
//         invoice_no: payload.invoice_no,
//       };
//       const hero: any = await this.apiCall.heroZoneApiCall(heroPayload);
//       if (!hero) {
//         console.log(`Hero not update`);
//       }
//     }
//   }
// }
