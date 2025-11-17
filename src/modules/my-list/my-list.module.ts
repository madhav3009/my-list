import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { MyList, MyListSchema } from './my-list.schema';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MyList.name, schema: MyListSchema }]),
    ContentModule,
  ],
  controllers: [MyListController],
  providers: [MyListService],
})
export class MyListModule {}