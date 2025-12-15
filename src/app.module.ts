import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { MailModule } from './mail/mail.module';
import { OrganizationModule } from './organization/organization.module';
import { Organization } from './organization/entities/organization.entity';
import { OrganizationMember } from './organization/entities/organization-member.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Organization, OrganizationMember, Project],
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    MailModule,
    OrganizationModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
