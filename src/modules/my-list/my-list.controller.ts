import { Controller, Post, Delete, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { MyListService } from './my-list.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddToListDto } from './dto/add-to-list.dto';
import { ListItemsDto } from './dto/list-items.dto';
import { handleError } from '../../common/utils/handle-error';

@Controller('my-list')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToList(@CurrentUser() userId: string, @Body() dto: AddToListDto) {
    try {
      const result = await this.myListService.addToList(userId, dto);
      return {
        success: true,
        message: 'Item added to your list',
        data: result,
      };
    } catch (error) {
      handleError(error);
    }
  }

  @Delete(':contentId')
  @HttpCode(HttpStatus.OK)
  async removeFromList(
    @CurrentUser() userId: string,
    @Param('contentId') contentId: string,
  ) {
    const result = await this.myListService.removeFromList(userId, contentId);
    return {
      success: true,
      message: 'Item removed from your list successfully',
      data: result,
    };
  }

  @Get()
  async getMyList(
    @CurrentUser() userId: string,
    @Query() dto: ListItemsDto,
  ) {
    const result = await this.myListService.getMyList(userId, dto);
    return {
      success: true,
      data: result,
    };
  }
}