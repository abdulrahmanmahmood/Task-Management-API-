import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { OrganizationResponseDto } from './dto/organization-response.dto';

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
    const savedOrganization =
      await this.OrganizationRepository.save(organization);
    return plainToInstance(OrganizationResponseDto, savedOrganization, {
      excludeExtraneousValues: false,
    });
  }

  findAll() {
    return this.OrganizationRepository.find({
      relations: ['Owner'],
    });
  }

  async findOne(id: string) {
    const organization = await this.OrganizationRepository.findOne({
      where: { id: id },
      relations: ['Owner'],
    });
    if (!organization) {
      throw new BadRequestException(`Organization with ID ${id} not found`);
    }
    return plainToInstance(OrganizationResponseDto, organization, {
      excludeExtraneousValues: false,
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const orgainzation = await this.findOne(id);
    if (!orgainzation) {
      throw new BadRequestException(`Organization with ID ${id} not found`);
    }
    return await this.OrganizationRepository.update(id, updateOrganizationDto);
  }

  remove(id: string) {
    const deleted = this.OrganizationRepository.delete(id);
    return {
      message: `Organization with ID ${id} has been deleted.`,
      deleted,
    };
  }
}
