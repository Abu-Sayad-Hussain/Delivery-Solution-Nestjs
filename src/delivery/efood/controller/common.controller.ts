import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  Put,
  Req,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EfoodCommonService } from '../service/common.service';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { DeliveryDto, DeliveryQueryDto } from '../../dto/delivery.dto';
import { AuthGuard } from '@nestjs/passport';
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { GroupsGuard } from "../../../common/guards/groups.guard";
import { Groups } from 'src/common/decorators/groups.decorator';

@Controller('api/v1.0.0/delivery/efood')
@UseInterceptors(ResponseInterceptor)
export class EfoodCommonController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly efoodCommonService: EfoodCommonService
  ) {}

  @Post()
  @UseGuards(AuthGuard(['evaly-secret']))
  async create(@Body() createDeliveryDto: DeliveryDto) {
    try {
      const delivery = await this.efoodCommonService.create(
        createDeliveryDto,
      );
      if (!delivery){
        throw new Error('Delivery not create!');
      }
      return {
        message: 'Delivery has been created successfully',
        delivery,
      };
    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
      };
    }
  }

  @Get()
  @UseGuards(AuthGuard(['jwt']))
  async findAll(@Query() deliveryQuery: DeliveryQueryDto) {
    try {
      const delivery = await this.efoodCommonService.findAll(deliveryQuery);
      if (!delivery) {
        throw new NotFoundException('Delivery does not exist!');
      }
      return delivery;
    }catch (err) {
      return {
        message: err.message,
        statusCode: 400,
      };
    }
  }

  @Get('/:delivery_id')
  @UseGuards(AuthGuard(['jwt']))
  public async findByDeliveryId(@Param('delivery_id') deliveryId: string) {
    try {
      const delivery = await this.efoodCommonService.findByDeliveryId(
        deliveryId,
      );
      if (!delivery) {
        throw new NotFoundException('Delivery does not exist!');
      }
      return delivery;
    }catch (err) {
      return {
        message: err.message,
        statusCode: 400,
      };
    }
  }

  @Put('/:delivery_id')
  @UseGuards(AuthGuard(['evaly-secret']))
  public async updateByDeliveryId(
    @Req() req,
    @Param('delivery_id') deliveryId: string,
    @Body() updateDeliveryDto: DeliveryDto,
  ) {
    try {
      updateDeliveryDto.updated_by = req.user.username;
      const delivery = await this.efoodCommonService.updateByDeliveryId(
        deliveryId,
        updateDeliveryDto,
      );
      if (!delivery) {
        throw new NotFoundException('Delivery does not exist!');
      }
      return {
        message: 'Delivery has been successfully updated',
        delivery,
      };
    } catch (err) {
      return {
        message: err.message,
        status: 400,
      };
    }
  }

  @Post('/hero/update-delivery')
  @UseGuards(AuthGuard(['evaly-secret', 'jwt']))
  public async updateStatusByOrderId(
    @Req() req,
    @Body() updateDeliveryDto: DeliveryDto,
  ) {
    try {
      updateDeliveryDto.updated_by = req.user.username ? req.user.username : 'api call';
      const delivery = await this.efoodCommonService.updateStatusByOrderId(updateDeliveryDto);
      if (!delivery) {
        throw new NotFoundException('Delivery does not exist!');
      }
      return {
        statusCode: 200,
        message: 'Delivery has been successfully updated',
        delivery,
      };
    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
      };
    }
  }

  // get delivery of hero by hero id, status = all, active, any delivery status
  @Get('/hero/active-order/:hero_id')
  @UseGuards(AuthGuard(['jwt']), GroupsGuard)
  @Groups('DeliveryHero')
  public async heroActiveOrderByHeroId(
    @Param('hero_id') heroId: string,
    @Query() deliveryQuery: DeliveryQueryDto
  ) {
    try {
      const delivery = await this.efoodCommonService.heroActiveOrderByHeroId(heroId, deliveryQuery);
      if (!delivery) {
        throw new NotFoundException('Delivery does not exist!');
      }
      return {
        statusCode: 200,
        data: delivery,
      };
    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
      };
    }
  }
}
