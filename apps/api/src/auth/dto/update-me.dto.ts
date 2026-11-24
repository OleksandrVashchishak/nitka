import { IsIn, IsOptional } from 'class-validator';

export class UpdateMeDto {
  /** Для узгодження дієслів у сповіщеннях партнеру: «додав» / «додала». */
  @IsOptional()
  @IsIn(['female', 'male', null])
  gender?: 'female' | 'male' | null;
}
