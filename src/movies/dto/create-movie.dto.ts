import {IsEnum, IsString, IsInt, IsArray,ArrayNotEmpty, IsUrl, IsNumber, Min, Max, IsPositive } from 'class-validator';

export enum Genre {
  Action = 'Action',
  Adventure = 'Adventure',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Crime = 'Crime',
  Fantasy = 'Fantasy',
  Horror = 'Horror',
  Thriller = 'Thriller',
  SciFi = 'Sci-Fi',
}

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  director: string;

  @IsInt()
  @Max(new Date().getFullYear())
  @Min(1900) 
  year: number;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsArray()
  @ArrayNotEmpty()         
  @IsEnum(Genre, { each: true })
  genre: Genre[];

  @IsUrl()
  poster: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rate: number = 5;
}
