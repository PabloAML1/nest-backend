import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { Genre } from '../src/movies/dto/create-movie.dto';

describe('GET /movies (e2e)', () => {
  let app: INestApplication;
  let originalMoviesData: any[];
  const moviesPath = path.join(__dirname, '../movies.json');

  // Datos de prueba para películas
  const testMoviePayload = {
    title: 'Integration Test Movie',
    director: 'Test Director',
    year: 2024,
    duration: 120,
    genre: [Genre.Action, Genre.Adventure],
    poster: 'https://example.com/poster.jpg',
    rate: 7.5,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    const data = fs.readFileSync(moviesPath, 'utf-8');
    originalMoviesData = JSON.parse(data);
  });

  afterEach(() => {
    fs.writeFileSync(moviesPath, JSON.stringify(originalMoviesData, null, 2));
  });

  async function createTestMovie(payload = testMoviePayload) {
    const response = await request(app.getHttpServer())
      .post('/movies')
      .send(payload)
      .expect(201);
    return response.body;
  }

  describe('Test 1: Listar todas las películas', () => {
    it('should return all movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return movies with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);

      const firstMovie = response.body[0];
      expect(firstMovie).toHaveProperty('id');
      expect(firstMovie).toHaveProperty('title');
      expect(firstMovie).toHaveProperty('director');
      expect(firstMovie).toHaveProperty('year');
      expect(firstMovie).toHaveProperty('duration');
      expect(firstMovie).toHaveProperty('genre');
      expect(firstMovie).toHaveProperty('poster');
      expect(firstMovie).toHaveProperty('rate');
    });
  });

  describe('Test 2: Filtrar por género existente', () => {
    beforeEach(async () => {
      // Crear película de prueba con género Action
      await createTestMovie({
        title: 'Action Test Movie',
        director: 'Action Director',
        year: 2024,
        duration: 120,
        genre: [Genre.Action],
        poster: 'https://example.com/action.jpg',
        rate: 8.0,
      });
    });

    it('should filter movies by genre (Action)', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'Action' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Verificar que todas las películas contienen el género Action
      response.body.forEach((movie: any) => {
        const genresLowerCase = movie.genre.map((g: string) => g.toLowerCase());
        expect(genresLowerCase).toContain('action');
      });
    });
  });

  describe('Test 3: Case-insensitive filtering', () => {
    beforeEach(async () => {
      // Crear película de prueba con género Comedy
      await createTestMovie({
        title: 'Comedy Test Movie',
        director: 'Comedy Director',
        year: 2024,
        duration: 90,
        genre: [Genre.Comedy],
        poster: 'https://example.com/comedy.jpg',
        rate: 7.0,
      });
    });

    it('should return same results for different cases (action, ACTION, AcTiOn)', async () => {
      const responseLower = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'comedy' })
        .expect(200);

      const responseUpper = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'COMEDY' })
        .expect(200);

      const responseMixed = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'CoMeDy' })
        .expect(200);

      expect(responseLower.body.length).toBe(responseUpper.body.length);
      expect(responseLower.body.length).toBe(responseMixed.body.length);
      expect(responseLower.body.length).toBeGreaterThan(0);
    });
  });

  describe('Test 4: Género inexistente', () => {
    it('should return empty array for non-existent genre', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'GeneroInexistente' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([]);
    });
  });

  describe('Test 5: Películas con múltiples géneros', () => {
    beforeEach(async () => {
      // Crear películas con múltiples géneros
      await createTestMovie({
        title: 'Action Drama Movie',
        director: 'Multi-Genre Director',
        year: 2024,
        duration: 150,
        genre: [Genre.Action, Genre.Drama],
        poster: 'https://example.com/action-drama.jpg',
        rate: 8.5,
      });

      await createTestMovie({
        title: 'Pure Drama Movie',
        director: 'Drama Director',
        year: 2024,
        duration: 130,
        genre: [Genre.Drama],
        poster: 'https://example.com/drama.jpg',
        rate: 9.0,
      });
    });

    it('should include movies with multiple genres when one matches', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ genre: 'Drama' })
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);

      // Verificar que ambas películas aparecen en el resultado
      const titles = response.body.map((movie: any) => movie.title);
      expect(titles).toContain('Action Drama Movie');
      expect(titles).toContain('Pure Drama Movie');
    });
  });
});
