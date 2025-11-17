import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../modules/user/user.schema';
import { Movie } from '../modules/content/schemas/movie.schema';
import { TVShow } from '../modules/content/schemas/tvshow.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const movieModel = app.get<Model<Movie>>(getModelToken(Movie.name));
  const tvShowModel = app.get<Model<TVShow>>(getModelToken(TVShow.name));

  // Clear existing data
  await Promise.all([
    userModel.deleteMany({}),
    movieModel.deleteMany({}),
    tvShowModel.deleteMany({}),
  ]);

  // Seed users
  const users = await userModel.insertMany([
    {
      username: 'john_doe',
      preferences: {
        favoriteGenres: ['Action', 'SciFi'],
        dislikedGenres: ['Horror'],
      },
      watchHistory: [],
    },
    {
      username: 'jane_smith',
      preferences: {
        favoriteGenres: ['Drama', 'Romance'],
        dislikedGenres: ['Horror'],
      },
      watchHistory: [],
    },
  ]);

  // Seed movies
  const movies = await movieModel.insertMany([
    {
      title: 'The Matrix',
      description: 'A computer hacker learns about the true nature of reality.',
      genres: ['Action', 'SciFi'],
      releaseDate: new Date('1999-03-31'),
      director: 'Wachowski Brothers',
      actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    },
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      genres: ['Action', 'SciFi'],
      releaseDate: new Date('2010-07-16'),
      director: 'Christopher Nolan',
      actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
    },
    {
      title: 'The Shawshank Redemption',
      description: 'Two imprisoned men bond over years, finding solace and redemption.',
      genres: ['Drama'],
      releaseDate: new Date('1994-09-23'),
      director: 'Frank Darabont',
      actors: ['Tim Robbins', 'Morgan Freeman'],
    },
    {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker in a battle for Gotham\'s soul.',
      genres: ['Action', 'Drama'],
      releaseDate: new Date('2008-07-18'),
      director: 'Christopher Nolan',
      actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      genres: ['SciFi', 'Drama'],
      releaseDate: new Date('2014-11-07'),
      director: 'Christopher Nolan',
      actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    },
  ]);

  // Seed TV shows
  const tvShows = await tvShowModel.insertMany([
    {
      title: 'Breaking Bad',
      description: 'A high school chemistry teacher turned methamphetamine producer.',
      genres: ['Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2008-01-20'),
          director: 'Vince Gilligan',
          actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
        },
        {
          episodeNumber: 2,
          seasonNumber: 1,
          releaseDate: new Date('2008-01-27'),
          director: 'Vince Gilligan',
          actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
        },
      ],
    },
    {
      title: 'Stranger Things',
      description: 'A group of kids uncover supernatural mysteries in their town.',
      genres: ['SciFi', 'Horror', 'Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2016-07-15'),
          director: 'Duffer Brothers',
          actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
        },
      ],
    },
    {
      title: 'The Office',
      description: 'A mockumentary about office employees.',
      genres: ['Comedy'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2005-03-24'),
          director: 'Greg Daniels',
          actors: ['Steve Carell', 'Rainn Wilson', 'John Krasinski'],
        },
      ],
    },
    {
      title: 'Game of Thrones',
      description: 'Noble families vie for control of the Iron Throne.',
      genres: ['Fantasy', 'Drama', 'Action'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2011-04-17'),
          director: 'David Benioff',
          actors: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage'],
        },
      ],
    },
  ]);

  console.log('✅ Seed data created successfully!');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🎬 Movies: ${movies.length}`);
  console.log(`📺 TV Shows: ${tvShows.length}`);
  console.log('\nSample User ID for testing:', users[0]?._id?.toString());
  console.log('Sample Movie ID:', movies[0]?._id?.toString());
  console.log('Sample TV Show ID:', tvShows[0]?._id?.toString());

  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });