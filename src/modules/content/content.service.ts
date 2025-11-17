import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { TVShow } from './schemas/tvshow.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  async findMovieById(id: string): Promise<Movie | null> {
    return this.movieModel.findById(id).exec();
  }

  async findTVShowById(id: string): Promise<TVShow | null> {
    return this.tvShowModel.findById(id).exec();
  }

  async findContentById(id: string, type: 'movie' | 'tvshow'): Promise<Movie | TVShow | null> {
    if (type === 'movie') {
      return this.findMovieById(id);
    }
    return this.findTVShowById(id);
  }
}
