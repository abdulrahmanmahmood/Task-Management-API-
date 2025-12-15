import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/enums/role.enums';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Roles(Role.ADMIN)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }

  @Post(':id/members')
  @Roles(Role.ADMIN)
  async inviteMember(
    @Param('id') id: string,
    @Body() inviteDto: InviteMemberDto,
  ) {
    return await this.organizationService.inviteMember(id, inviteDto);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return await this.organizationService.getMembers(id);
  }

  @Patch(':id/members/:userId')
  @Roles(Role.ADMIN)
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.organizationService.updateMemberRole(
      id,
      userId,
      updateMemberDto,
    );
  }

  @Delete(':id/members/:userId')
  @Roles(Role.ADMIN)
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return await this.organizationService.removeMember(id, userId);
  }

  @Get('user/:userId/organizations')
  async getUserOrganizations(@Param('userId') userId: string) {
    return await this.organizationService.getUserOrganizations(userId);
  }
}
