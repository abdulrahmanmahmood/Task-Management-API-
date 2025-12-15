import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { OrganizationMember } from './entities/organization-member.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { OrganizationRole } from '../enums/organization-role.enum';
import { MemberResponseDto } from './dto/member-response.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly OrganizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly OrganizationMemberRepository: Repository<OrganizationMember>,
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

    const ownerMember = this.OrganizationMemberRepository.create({
      organizationId: savedOrganization.id,
      userId: OwnerId,
      role: OrganizationRole.OWNER,
    });

    await this.OrganizationMemberRepository.save(ownerMember);

    return plainToInstance(OrganizationResponseDto, savedOrganization, {
      excludeExtraneousValues: false,
    });
  }

  async findAll() {
    const organizations = await this.OrganizationRepository.find({
      relations: ['Owner'],
    });

    // For each organization, get the owner's organization role
    const orgResponses = await Promise.all(
      organizations.map(async (org) => {
        const ownerMembership = await this.OrganizationMemberRepository.findOne(
          {
            where: {
              organizationId: org.id,
              userId: org.Owner.id,
            },
          },
        );

        const orgResponse = plainToInstance(OrganizationResponseDto, org, {
          excludeExtraneousValues: false,
        });

        // Override the Owner's role with their organization-specific role
        if (ownerMembership && orgResponse.Owner) {
          orgResponse.Owner.role = ownerMembership.role as any;
        }

        return orgResponse;
      }),
    );

    return orgResponses;
  }

  async findOne(id: string) {
    const organization = await this.OrganizationRepository.findOne({
      where: { id: id },
      relations: ['Owner'],
    });
    if (!organization) {
      throw new BadRequestException(`Organization with ID ${id} not found`);
    }

    const memberCount = await this.OrganizationMemberRepository.count({
      where: { organizationId: id },
    });

    // Get the owner's organization role from OrganizationMember table
    const ownerMembership = await this.OrganizationMemberRepository.findOne({
      where: {
        organizationId: id,
        userId: organization.Owner.id,
      },
    });

    const orgResponse = plainToInstance(OrganizationResponseDto, organization, {
      excludeExtraneousValues: false,
    });

    // Override the Owner's role with their organization-specific role
    if (ownerMembership && orgResponse.Owner) {
      orgResponse.Owner.role = ownerMembership.role;
    }

    return {
      ...orgResponse,
      memberCount,
    };
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const orgainzation = await this.findOne(id);
    if (!orgainzation) {
      throw new BadRequestException(`Organization with ID ${id} not found`);
    }
    return await this.OrganizationRepository.update(id, updateOrganizationDto);
  }

  async remove(id: string) {
    const deleted = await this.OrganizationRepository.delete(id);
    return {
      message: `Organization with ID ${id} has been deleted.`,
      deleted,
    };
  }

  async inviteMember(orgId: string, inviteDto: InviteMemberDto) {
    const existOrganization = await this.findOne(orgId);
    if (!existOrganization) {
      throw new BadRequestException(`Organization with ID ${orgId} not found`);
    }
    const user = await this.userService.findOneById(inviteDto.userId);
    if (!user) {
      throw new BadRequestException(
        `User with ID ${inviteDto.userId} not found`,
      );
    }

    // check if the user already exists in the organization
    const existingMember = await this.OrganizationMemberRepository.findOne({
      where: {
        organizationId: orgId,
        userId: inviteDto.userId,
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        `User with ID ${inviteDto.userId} is already a member of the organization`,
      );
    }

    const organizationMember = this.OrganizationMemberRepository.create({
      organizationId: orgId,
      userId: inviteDto.userId,
      role: inviteDto.role,
    });

    const savedMember =
      await this.OrganizationMemberRepository.save(organizationMember);

    // Load member with user relation for proper DTO transformation
    const memberWithUser = await this.OrganizationMemberRepository.findOne({
      where: { id: savedMember.id },
      relations: ['user'],
    });

    return plainToInstance(MemberResponseDto, memberWithUser, {
      excludeExtraneousValues: true,
    });
  }

  async getMembers(orgId: string) {
    const existOrganization = await this.findOne(orgId);

    if (!existOrganization) {
      throw new BadRequestException(`Organization with ID ${orgId} not found`);
    }

    const members = await this.OrganizationMemberRepository.find({
      where: { organizationId: orgId },
      relations: ['user'],
      order: { joinedAt: 'DESC' },
    });
    return plainToInstance(MemberResponseDto, members, {
      excludeExtraneousValues: true,
    });
  }

  async updateMemberRole(
    orgId: string,
    userId: string,
    updateMemberDto: UpdateMemberDto,
  ) {
    const existOrganization = await this.findOne(orgId);

    if (!existOrganization) {
      throw new BadRequestException(`Organization with ID ${orgId} not found`);
    }

    const member = await this.OrganizationMemberRepository.findOne({
      where: { userId: userId, organizationId: orgId },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException(
        `Member with user ID ${userId} not found in this organization`,
      );
    }

    // Prevent changing OWNER role (business rule)
    if (member.role === OrganizationRole.OWNER) {
      throw new BadRequestException('Cannot change role of organization owner');
    }

    member.role = updateMemberDto.role;
    const updatedMember = await this.OrganizationMemberRepository.save(member);

    return plainToInstance(MemberResponseDto, updatedMember, {
      excludeExtraneousValues: true,
    });
  }

  async removeMember(orgId: string, userId: string) {
    const existOrganization = await this.findOne(orgId);

    if (!existOrganization) {
      throw new BadRequestException(`Organization with ID ${orgId} not found`);
    }

    const member = await this.OrganizationMemberRepository.findOne({
      where: { organizationId: orgId, userId: userId },
    });

    if (!member) {
      throw new NotFoundException(
        `Member with user ID ${userId} not found in this organization`,
      );
    }

    // Prevent removing organization owner
    if (member.role === OrganizationRole.OWNER) {
      const ownerCount = await this.OrganizationMemberRepository.count({
        where: {
          organizationId: orgId,
          role: OrganizationRole.OWNER,
        },
      });
      if (ownerCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the only owner of the organization',
        );
      }
    }

    await this.OrganizationMemberRepository.delete(member.id);
    return {
      message: `Member has been removed from organization.`,
    };
  }

  async getUserOrganizations(userId: string) {
    const memberships = await this.OrganizationMemberRepository.find({
      where: { userId: userId },
      relations: ['organization', 'organization.Owner'],
      order: { joinedAt: 'DESC' },
    });

    return memberships.map((membership) => ({
      ...membership.organization,
      userRole: membership.role,
      joinedAt: membership.joinedAt,
    }));
  }

  async isMember(orgId: string, userId: string): Promise<boolean> {
    const member = await this.OrganizationMemberRepository.findOne({
      where: { organizationId: orgId, userId: userId },
    });
    return !!member;
  }

  async getMemberRole(
    orgId: string,
    userId: string,
  ): Promise<OrganizationRole | null> {
    const member = await this.OrganizationMemberRepository.findOne({
      where: { organizationId: orgId, userId: userId },
    });
    return member ? member.role : null;
  }
}
