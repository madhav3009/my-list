import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class AddToListDto {
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @IsEnum(['movie', 'tvshow'])
  contentType: 'movie' | 'tvshow';
}