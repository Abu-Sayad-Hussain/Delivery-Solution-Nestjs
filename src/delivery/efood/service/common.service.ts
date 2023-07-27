import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Delivery, DeliveryDocument } from "../../schemas/delivery.schema";
import { DeliveryDto, DeliveryQueryDto } from "../../dto/delivery.dto";
import { DeliveryService } from "../../delivery.service";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { DeliveryState } from "../../enum/delivery_status.enum";

@Injectable()
export class EfoodCommonService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: Model<DeliveryDocument>,
    private readonly deliveryService: DeliveryService,
  ) {}

  async create(createDelivery: DeliveryDto): Promise<Delivery> {
    try{
      if (![DeliveryState.PENDING, DeliveryState.ASSIGNED].includes(createDelivery.delivery_status)){
        throw  new Error('Can not create delivery!')
      }
      if (createDelivery.reassign_reason){
        // @ts-ignore
        const update: DeliveryDto = {
          delivery_status: DeliveryState.CANCELED,
          reassign_reason: createDelivery.reassign_reason
        }
        const existingDelivery = await this.deliveryService
          .updateByDeliveryId(
            {
              context_id: createDelivery.context_id,
              delivery_status: {$ne: 'canceled'}
            },
            update
          );

        if (!existingDelivery) {
          throw new NotFoundException(`Delivery #${createDelivery.context_id} not found`);
        }
      }
      createDelivery.delivery_id = 'EVD' + Math.floor(Math.random() * 1000000);
      if (createDelivery.delivery_hero) {
        const hero = { ...createDelivery.delivery_hero };
        createDelivery.delivery_hero_alias = hero.hero_alias;
      }
      const createdDelivery = await this.deliveryService.createDelivery(
        createDelivery,
      );

      return createdDelivery;
    }
    catch (err) {
      console.log('Error from create', err);
      throw err;
    }

  }

  async findAll(query: DeliveryQueryDto): Promise<Delivery[]> {
    try {
      let foundDeliveries;
      const { limit, offset } = query;
      if (query.limit) delete query.limit;
      if (query.offset) delete query.offset;

      if (query.start_date && query.end_date) {
        query.end_date.setUTCHours(23, 59, 59);
        const filterQuery = this.deliveryModel.find({
          createdAt: {
            $gte: query.start_date.toISOString(),
            $lte: query.end_date.toISOString(),
          },
        });
        foundDeliveries = await this.deliveryService.findAllDelivery(
          filterQuery,
          limit,
          offset,
        );
      } else {
        foundDeliveries = await this.deliveryService.findAllDelivery(
          query,
          limit,
          offset,
        );
      }
      return foundDeliveries;
    }
    catch (err) {
      console.log('Error from findAll', err);
      throw err;
    }
  }

  async findByDeliveryId(deliveryId: string): Promise<Delivery> {
    try {
      const delivery = await this.deliveryService.findByDeliveryId({
        delivery_id: deliveryId,
      });

      if (!delivery) {
        throw new NotFoundException(`Delivery #${deliveryId} not found`);
      }
      return delivery;
    }
    catch (err) {
      console.log('Error from findByDeliveryId', err);
      throw err;
    }
  }

  public async updateByDeliveryId(
    deliveryId: string,
    updateDelivery: DeliveryDto,
  ): Promise<Delivery> {
    try {
      const fields: string[] = [
        'meta',
        'cancel_note',
        'delivery_hero_alias',
        'delivery_hero',
        'delivery_charge',
        'paid_delivery_charge',
        'delivery_end_time',
        'status',
        'delivery_status',
        'user_location',
        'hero_location',
        'marchant_location',
      ];
      Object.keys(updateDelivery).map((field) => {
        if (!fields.includes(field)) {
          delete updateDelivery[field];
        }
      });

      const existingDelivery = await this.deliveryService.updateByDeliveryId(
        { delivery_id: deliveryId },
        updateDelivery,
      );
      if (!existingDelivery) {
        throw new NotFoundException(`Delivery #${deliveryId} not found`);
      }
      return existingDelivery;
    }
    catch (err) {
      console.log('Error from updateByDeliveryId', err);
      throw err;
    }
  }

  public async updateStatusByOrderId(
    updateDelivery: DeliveryDto
  ): Promise<Delivery> {
    try {
      if (!updateDelivery.context_id) {
        throw new BadRequestException("Invoice no must be provide");
      }
      const fields: string[] = ['updated_by', 'hero_location', 'cancel_note', 'user_location', 'confirmation_proof', 'confirmed_at', 'confirmed', 'confirmed_by', 'delivery_status', 'delivery_address'];
      const context_id = updateDelivery.context_id;
      Object.keys(updateDelivery).map((field) => {
        if (!fields.includes(field)) {
          delete updateDelivery[field];
        }
      });
      const existingDelivery = await this.deliveryService.updateByDeliveryId(
        {
          context_id,
          delivery_status: {$ne: 'canceled'}
        },
        updateDelivery
      );

      if (!existingDelivery) {
        throw new NotFoundException(`Delivery #${updateDelivery.context_id} not found`);
      }

      return existingDelivery;
    }catch (err) {
      console.log('updateStatusByOrderId error-->'+ err);
      throw new Error(err.message);
    }
  }

  async heroActiveOrderByHeroId(heroId: string, query: DeliveryQueryDto): Promise<Delivery[]> {
    try {
      let matchQuery = {};
      const { limit, offset } = query;
      if (query.limit) delete query.limit;
      if (query.offset) delete query.offset;

      if (query.delivery === 'active'){
        matchQuery = {delivery_status: { $ne: DeliveryState.CANCELED }}
      }
      if (!['all', 'active'].includes(query.delivery)){
        matchQuery = {delivery_status: { $eq: query.delivery }}
      }

      const foundDeliveries = await this.deliveryService.findAllDelivery(
        { delivery_hero_alias: heroId, ...matchQuery },
        limit,
        offset,
      );

      return foundDeliveries;
    }
    catch (err) {
      console.log('Error from findAll', err);
      throw err;
    }
  }

}
