import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import * as fs from 'fs';
import { Genre } from './dto/create-movie.dto';

jest.mock('fs');

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovies = [
    {
      id: 'c71e1c92-4f8b-4ec4-9ae8-9b7f4b8d1201',
      title: 'Blade Runner 2049',
      year: 2017,
      director: 'Denis Villeneuve',
      duration: 164,
      poster:
        'https://m.media-amazon.com/images/I/81GqKQZ6DLL._AC_UF1000,1000_QL80_.jpg',
      genre: [Genre.SciFi, Genre.Drama],
      rate: 8.0,
    },
    {
      id: 'e52f4d33-8b94-4c8d-9af1-77e689cd4502',
      title: 'Whiplash',
      year: 2014,
      director: 'Damien Chazelle',
      duration: 107,
      poster:
        'https://m.media-amazon.com/images/I/71QOaZsa1KL._AC_UF1000,1000_QL80_.jpg',
      genre: [Genre.Drama],
      rate: 8.5,
    },
  ];

  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockMovies),
    );
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    service = new MoviesService();
  });

  it('should create a new movie', () => {
    const dto = {
      title: 'The Prestige',
      year: 2006,
      director: 'Christopher Nolan',
      duration: 130,
      poster: 'https://m.media-amazon.com/images/I/71B0ZQbhl3L._AC_.jpg',
      genre: [Genre.Drama, Genre.Thriller],
      rate: 8.5,
    };

    const result = service.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe('The Prestige');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});

//   it('should return all movies', () => {
//     const result = service.findAll();
//     expect(result.length).toBe(2);
//   });

//   it('should filter movies by genre', () => {
//     const result = service.findAll('Drama');

//     expect(result.length).toBe(2);
//   });

//   it('should return a movie by ID', () => {
//     const result = service.findOne(
//       'c71e1c92-4f8b-4ec4-9ae8-9b7f4b8d1201',
//     );

//     expect(result).toBeDefined();
//     expect(result.title).toBe('Blade Runner 2049');
//   });

//   it('should throw NotFoundException if movie not found', () => {
//     expect(() =>
//       service.findOne('99999999-0000-0000-0000-000000000000'),
//     ).toThrow(NotFoundException);
//   });

//   it('should update a movie', () => {
//     const dto = { title: 'Blade Runner — Updated' };

//     const result = service.update(
//       'c71e1c92-4f8b-4ec4-9ae8-9b7f4b8d1201',
//       dto,
//     );

//     expect(result.title).toBe('Blade Runner — Updated');
//     expect(fs.writeFileSync).toHaveBeenCalled();
//   });

//   it('should throw NotFoundException if movie does not exist', () => {
//     expect(() =>
//       service.update('2222222-2222-3333-4444-555555555555', {
//         title: 'X',
//       }),
//     ).toThrow(NotFoundException);
//   });

//   it('should remove a movie', () => {
//     const result = service.remove(
//       'e52f4d33-8b94-4c8d-9af1-77e689cd4502',
//     );

//     expect(result.title).toBe('Whiplash');
//     expect(fs.writeFileSync).toHaveBeenCalled();
//   });

//   it('should throw NotFoundException if movie does not exist', () => {
//     expect(() =>
//       service.remove('00000000-0000-0000-0000-000000000123'),
//     ).toThrow(NotFoundException);
//   });
// });
