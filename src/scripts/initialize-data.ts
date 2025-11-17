import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../modules/user/user.schema';
import { Movie } from '../modules/content/schemas/movie.schema';
import { TVShow } from '../modules/content/schemas/tvshow.schema';

async function initialize() {
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

  // initialize users
  const users = await userModel.insertMany([
    {
      username: 'madhav',
      preferences: {
        favoriteGenres: ['Action', 'Drama'],
        dislikedGenres: ['Horror'],
      },
      watchHistory: [],
    },
    {
      username: 'stage_user',
      preferences: {
        favoriteGenres: ['Romance', 'Comedy'],
        dislikedGenres: ['Horror'],
      },
      watchHistory: [],
    },
  ]);
  

  // initialize movies
  const movies = await movieModel.insertMany([
    {
      title: '3 Idiots',
      description: 'Three engineering students navigate friendship and pressure.',
      genres: ['Drama', 'Comedy'],
      releaseDate: new Date('2009-12-25'),
      director: 'Rajkumar Hirani',
      actors: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi'],
    },
    {
      title: 'Bahubali: The Beginning',
      description: 'The epic rise of Shivudu as he discovers his destiny.',
      genres: ['Action', 'Fantasy'],
      releaseDate: new Date('2015-07-10'),
      director: 'S. S. Rajamouli',
      actors: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'],
    },
    {
      title: 'Bahubali: The Conclusion',
      description: 'Mahendra Baahubali sets out to avenge his father and reclaim the throne.',
      genres: ['Action', 'Fantasy'],
      releaseDate: new Date('2017-04-28'),
      director: 'S. S. Rajamouli',
      actors: ['Prabhas', 'Anushka Shetty', 'Rana Daggubati'],
    },
    {
      title: 'Dangal',
      description: 'A father trains his daughters to become world-class wrestlers.',
      genres: ['Drama', 'Sports'],
      releaseDate: new Date('2016-12-23'),
      director: 'Nitesh Tiwari',
      actors: ['Aamir Khan', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
    },
    {
      title: 'KGF: Chapter 1',
      description: 'The rise of Rocky in the gold mines of Kolar.',
      genres: ['Action', 'Drama'],
      releaseDate: new Date('2018-12-21'),
      director: 'Prashanth Neel',
      actors: ['Yash', 'Srinidhi Shetty', 'Ananth Nag'],
    },
  ]);
  

  // initialize TV shows
  const tvShows = await tvShowModel.insertMany([
    {
      title: 'Sacred Games',
      description: 'A cop uncovers a criminal network threatening Mumbai.',
      genres: ['Thriller', 'Crime', 'Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2018-07-06'),
          director: 'Vikramaditya Motwane',
          actors: ['Saif Ali Khan', 'Nawazuddin Siddiqui', 'Radhika Apte'],
        },
      ],
    },
    {
      title: 'Mirzapur',
      description: 'A mafia-driven power struggle in a lawless town.',
      genres: ['Crime', 'Action', 'Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2018-11-16'),
          director: 'Karan Anshuman',
          actors: ['Pankaj Tripathi', 'Ali Fazal', 'Divyenndu'],
        },
      ],
    },
    {
      title: 'The Family Man',
      description: 'A middle-class man secretly working as an intelligence officer.',
      genres: ['Action', 'Thriller', 'Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2019-09-20'),
          director: 'Raj & DK',
          actors: ['Manoj Bajpayee', 'Priyamani'],
        },
      ],
    },
    {
      title: 'Panchayat',
      description: 'A young man becomes secretary of a village panchayat.',
      genres: ['Comedy', 'Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2020-04-03'),
          director: 'Deepak Kumar Mishra',
          actors: ['Jitendra Kumar', 'Raghubir Yadav', 'Neena Gupta'],
        },
      ],
    },
  ]);
  

  console.log('✅ initialize data created successfully!');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🎬 Movies: ${movies.length}`);
  console.log(`📺 TV Shows: ${tvShows.length}`);
  console.log('\nSample User ID for testing:', users[0]?._id?.toString());
  console.log('Sample Movie ID:', movies[0]?._id?.toString());
  console.log('Sample TV Show ID:', tvShows[0]?._id?.toString());

  await app.close();
}

initialize()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ initialize failed:', err);
    process.exit(1);
  });