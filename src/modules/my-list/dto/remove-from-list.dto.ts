import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveFromListDto {
  @IsString()
  @IsNotEmpty()
  contentId: string;
}
