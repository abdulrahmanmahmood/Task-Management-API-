import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly OrganizationRepository: Repository<Organization>,
    private readonly userService: UsersService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { OwnerId, name, description } = createOrganizationDto;
    const user = await this.userService.findOneById(OwnerId);
    if (!user) {
      throw new BadRequestException(`User with ID ${OwnerId} not found`);
    }
    const organization = this.OrganizationRepository.create({
      name,
      description,
      Owner: user,
    });
    return await this.OrganizationRepository.save(organization);
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
