import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class QueryUsersDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC';
}
