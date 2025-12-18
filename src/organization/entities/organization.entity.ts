import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.organizationOwner)
  @JoinColumn({ name: 'Owner_id' })
  Owner: User;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  memberDetails: OrganizationMember[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];
}
