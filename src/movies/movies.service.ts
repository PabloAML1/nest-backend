import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MoviesService {

  private moviesPath = path.join(__dirname, '../../movies.json');

  private readMovies() {
  const data = fs.readFileSync(this.moviesPath, 'utf-8');
  return JSON.parse(data);
}

  create(createMovieDto: CreateMovieDto) {
    const movies = this.readMovies();
    const newMovie = {
      id: uuidv4(),
      ...createMovieDto,
    };

    (movies as any[]).push(newMovie);

    fs.writeFileSync(this.moviesPath, JSON.stringify(movies, null, 2));

    return newMovie;
  }

  findAll(genre?: string) {
    const movies = this.readMovies();
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return filteredMovies;
    }
    return movies;
  }

  findOne(id: string) {
    const movies = this.readMovies();
    const movie = movies.find((movie) => movie.id === id);
    if (movie) {
      return movie;
    } else {
      throw new NotFoundException(`Movie with ID ${id} not found.`)
    }
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    const movies = this.readMovies();
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex == -1) {
      throw new NotFoundException(`Movie with ID ${id} not found.`)
    }
    const updatedMovie = {
      ...movies[movieIndex],
      ...updateMovieDto
    };
    movies[movieIndex] = updatedMovie;
    fs.writeFileSync(this.moviesPath, JSON.stringify(movies, null, 2));
    return updatedMovie;
  }

  remove(id: string) {
    const movies = this.readMovies();
    const index = movies.findIndex(movie => movie.id === id);

    if (index === -1) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const deletedMovie = movies.splice(index, 1)[0];

    fs.writeFileSync(this.moviesPath, JSON.stringify(movies, null, 2));

    return deletedMovie;
  }
}
