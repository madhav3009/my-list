import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Genre } from '../../user/user.schema';

@Schema()
export class Episode {
  @Prop({ required: true })
  episodeNumber: number;

  @Prop({ required: true })
  seasonNumber: number;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], required: true })
  actors: string[];
}

@Schema({ timestamps: true })
export class TVShow extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, maxlength: 1000 })
  description: string;

  @Prop({ type: [String], required: true })
  genres: Genre[];

  @Prop({ type: [Episode], required: true })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);
TVShowSchema.index({ title: 1, genres: 1 });
