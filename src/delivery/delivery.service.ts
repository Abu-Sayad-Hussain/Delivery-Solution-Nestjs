import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Delivery, DeliveryDocument } from './schemas/delivery.schema';
import { DeliveryDto } from './dto/delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private readonly deliveryModel: Model<DeliveryDocument>,
  ) { }

  async createDelivery(createDelivery: DeliveryDto): Promise<Delivery> {
    try {
      const createdDelivery = await new this.deliveryModel(createDelivery);
      const saveDelivery = createdDelivery.save();

      return saveDelivery;
    }
    catch (err) {
      console.log('Error from createDelivery', err);
      throw err;
    }
  }

  async findAllDelivery(
    query: object,
    limit: number,
    offset: number
  ): Promise<Delivery[]> {
    try {
      let modelQuery = await this.deliveryModel
        .find(query)
        .skip(offset)
        .limit(limit)
        .exec();

      return modelQuery;
    }
    catch (err) {
      console.log('Error from findAllDelivery', err);
      throw err;
    }
  }

  async findByDeliveryId(query: object): Promise<Delivery> {
    try {
      const delivery = await this.deliveryModel
        .findOne(query)
        .exec();

      return delivery;
    }
    catch (err) {
      console.log('Error from findByDeliveryId', err);
      throw err;
    }
  }

  public async updateByDeliveryId(
    match: object,
    updateDelivery: DeliveryDto,
  ): Promise<Delivery> {
    try {
      const existingDelivery = await this.deliveryModel.findOneAndUpdate(
        match,
        updateDelivery,
        { new: true }
      );
      return existingDelivery;
    }
    catch (err) {
      console.log('Error from updateByDeliveryId', err);
      throw err;
    }
  }
}