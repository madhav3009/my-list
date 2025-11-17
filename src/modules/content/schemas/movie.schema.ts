import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Genre } from '../../user/user.schema';

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, maxlength: 1000 })
  description: string;

  @Prop({ type: [String], required: true })
  genres: Genre[];

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], required: true })
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.index({ title: 1, genres: 1 });
