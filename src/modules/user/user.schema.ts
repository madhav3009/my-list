import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

@Schema()
export class WatchHistory {
  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  watchedOn: Date;

  @Prop()
  rating?: number;
}

@Schema()
export class Preferences {
  @Prop({ type: [String] })
  favoriteGenres: Genre[];

  @Prop({ type: [String] })
  dislikedGenres: Genre[];
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: Preferences })
  preferences: Preferences;

  @Prop({ type: [WatchHistory] })
  watchHistory: WatchHistory[];
}

export const UserSchema = SchemaFactory.createForClass(User);