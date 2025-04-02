import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProjectDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;
}
