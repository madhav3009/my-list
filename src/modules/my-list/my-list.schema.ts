import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentType = 'movie' | 'tvshow';

@Schema()
export class ListItem {
  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true, enum: ['movie', 'tvshow'] })
  contentType: ContentType;

  @Prop({ required: true, default: Date.now })
  addedAt: Date;
}

@Schema({ timestamps: true })
export class MyList extends Document {
  @Prop({ required: true, index: true, unique: true })
  userId: string;

  @Prop({ type: [ListItem], default: [] })
  items: ListItem[];
}

export const MyListSchema = SchemaFactory.createForClass(MyList);

// Compound index for efficient queries
MyListSchema.index({ userId: 1, 'items.contentId': 1 });
MyListSchema.index({ userId: 1, 'items.addedAt': -1 });