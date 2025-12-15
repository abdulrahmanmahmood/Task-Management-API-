import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectStatus } from '../enums/project-status.enum';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANING,
  })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (org) => org.projects)
  @JoinColumn({ name: 'OrganizationId' })
  OrganizationId: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'createdById' })
  createdById: User;
}
