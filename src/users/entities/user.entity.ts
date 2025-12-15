import { Organization } from '../../organization/entities/organization.entity';
import { Role } from '../../enums/role.enums';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrganizationMember } from '../../organization/entities/organization-member.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordCode: string | null;

  @OneToMany(() => Organization, (organization) => organization.Owner)
  organizationOwner: Organization[];

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.user,
  )
  organizationMemberships: OrganizationMember[];

  @OneToMany(() => Project, (project) => project.createdById)
  projects: Project[];
}
