import { JoiSchema } from 'nestjs-joi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Joi from 'joi';
import { AssignType, CancelNote, DeliveryState } from "../enum/delivery_status.enum";
import { ApiProperty } from '@nestjs/swagger';

export class HeroDto {
  @JoiSchema(Joi.string())
  hero_alias: string;

  @JoiSchema(Joi.string())
  first_name: string;

  @JoiSchema(Joi.string())
  last_name: string;

  @JoiSchema(Joi.string())
  username: string;

  @JoiSchema(Joi.string())
  profile_pic_url: string;
}

const hero = {
  first_name: 'alam',
  last_name: 'khan',
  username: '01999999990',
  hero_alias: 'alam-@88',
  profile_pic:
    'https://s3-ap-southeast-1.amazonaws.com/media.evaly.com.bd/media/images/9543559e92a5-summer-dish-meal-food-produce-plate-830938-pxherecom_-1000x500.jpg',
};

export class DeliveryDto {
  delivery_id: string;

  @JoiSchema(Joi.string().valid(...Object.values(DeliveryState)))
  @ApiProperty({ default: DeliveryState.PENDING })
  delivery_status: DeliveryState;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'Dhanmonddi, Dhaka' })
  delivery_address: string;

  @JoiSchema(Joi.string().valid(...Object.values(AssignType)))
  @ApiProperty({ default: AssignType.ADMIN_ASSIGN })
  assign_type: AssignType;

  @JoiSchema(Joi.object())
  assign_by: object;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'xyz-8488' })
  shop_slug: string;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: '01999999990' })
  customer_user_name: string;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'xyz-abc' })
  delivery_hero_alias: string;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: hero })
  delivery_hero: HeroDto;

  @JoiSchema(Joi.number())
  @ApiProperty({ default: 70.00 })
  delivery_charge: number;

  @JoiSchema(Joi.number())
  @ApiProperty({ default: 40.00 })
  paid_delivery_charge: number;

  @JoiSchema(Joi.number())
  @ApiProperty({ default: 600.00 })
  purchase_cost: number;

  @JoiSchema(Joi.number())
  @ApiProperty({ default: 670.00 })
  total: number;

  @JoiSchema(Joi.date())
  delivery_start_time: Date;

  @JoiSchema(Joi.date())
  delivery_end_time: Date;

  @JoiSchema(Joi.string().valid(...Object.values(CancelNote)))
  @ApiProperty()
  cancel_note: CancelNote;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'efood' })
  context_type: string;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'EVD-678-HG' })
  context_id: string;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: { lat: '90.37264780000000000', lng: '90.37264780000000000'} })
  hero_location: object;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: { lat: '90.37264780000000000', lng: '90.37264780000000000'}  })
  user_location: object;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: { lat: '90.37264780000000000', lng: '90.37264780000000000'}  })
  merchant_location: object;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: { code: 3245, expires_at: '2021-02-18T10:10:05.422Z' }  })
  confirmation_proof: object;

  @JoiSchema(Joi.date())
  @ApiProperty({ default: '2021-02-18T10:10:05.422Z' })
  confirmed_at: Date;

  @JoiSchema(Joi.boolean())
  @ApiProperty({ default: false })
  confirmed: boolean;

  @JoiSchema(Joi.string())
  @ApiProperty({ default: 'alam-38478' })
  confirmed_by: string;

  @JoiSchema(Joi.string())
  reassign_reason: string;

  @JoiSchema(Joi.string())
  updated_by: string;

  @JoiSchema(Joi.object())
  @ApiProperty({ default: {} })
  meta: object;
}


export class DeliveryQueryDto {
  @JoiSchema(Joi.date())
  start_date: Date;

  @JoiSchema(Joi.date())
  end_date: Date;

  @JoiSchema(Joi.number())
  limit: number;

  @JoiSchema(Joi.number())
  offset: number;

  @JoiSchema(Joi.string())
  delivery: string;
}