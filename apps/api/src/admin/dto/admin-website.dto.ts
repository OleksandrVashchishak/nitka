import { IsBoolean } from 'class-validator';

export class SetWebsiteHiddenDto {
  @IsBoolean()
  hidden!: boolean;
}
