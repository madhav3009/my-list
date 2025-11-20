import { Injectable, NotFoundException, ConflictException, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MyList, ListItem } from './my-list.schema';
import { ContentService } from '../content/content.service';
import { AddToListDto } from './dto/add-to-list.dto';
import { ListItemsDto } from './dto/list-items.dto';
import { MAX_MY_LIST_ITEMS_LIMIT } from './my-list.constants';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(MyList.name) private myListModel: Model<MyList>,
    private contentService: ContentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(userId: string, page: number, limit: number): string {
    return `mylist:${userId}:${page}:${limit}`;
  }

  private async invalidateCache(userId: string): Promise<void> {
    // Invalidate all cache entries for the user - Ideally this won't require to delete multiple keys
    // But since i've allowed caching for variable pagination params
    const keys = await this.cacheManager.store.keys(`mylist:${userId}:*`);
    await Promise.all(keys.map(key => this.cacheManager.del(key)));
  }

  async addToList(userId: string, dto: AddToListDto): Promise<MyList> {
    // Validate content exists
    const content = await this.contentService.findContentById(dto.contentId, dto.contentType);
    if (!content) {
      throw new NotFoundException(`${dto.contentType} with id ${dto.contentId} not found`);
    }

    // Find or create user's list
    let userList = await this.myListModel.findOne({ userId }).exec();
    
    if (!userList) {
      userList = new this.myListModel({
        userId,
        items: [],
      });
    }

    // Max item limit check
    if(userList.items.length >= MAX_MY_LIST_ITEMS_LIMIT){
      throw new ForbiddenException(`You can have a maximum of ${MAX_MY_LIST_ITEMS_LIMIT} items in your list. Please remove some before adding new ones`);
    }

    // Check for duplicates
    const exists = userList.items.some(item => item.contentId === dto.contentId);
    if (exists) {
      throw new ConflictException('Item already exists in your list');
    }

    // Add item
    userList.items.push({
      contentId: dto.contentId,
      contentType: dto.contentType,
      addedAt: new Date(),
    });

    await userList.save();
    await this.invalidateCache(userId);

    return userList;
  }

  async removeFromList(userId: string, contentId: string): Promise<MyList> {
    const userList = await this.myListModel.findOne({ userId }).exec();
    
    if (!userList) {
      throw new NotFoundException('Content not found in your list');
    }

    const initialLength = userList.items.length;
    userList.items = userList.items.filter(item => item.contentId !== contentId);

    if (userList.items.length === initialLength) {
      throw new NotFoundException('Item not found in your list');
    }

    await userList.save();
    await this.invalidateCache(userId);

    return userList;
  }

  async getMyList(userId: string, dto: ListItemsDto) {
    const { page = 1, limit = 20 } = dto;
    const cacheKey = this.getCacheKey(userId, page, limit);

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Query with projection and pagination
    const skip = (page - 1) * limit;
    
    const userList = await this.myListModel
      .findOne({ userId })
      .select('items')
      .lean()
      .exec();

    if (!userList) {
      const response = {
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
      await this.cacheManager.set(cacheKey, response);
      return response;
    }

    // Sort by addedAt descending (most recent first)
    const sortedItems = userList.items.sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );

    const total = sortedItems.length;
    const paginatedItems = sortedItems.slice(skip, skip + limit);

    const response = {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await this.cacheManager.set(cacheKey, response);

    return response;
  }
}