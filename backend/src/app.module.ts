import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmployeesModule,
    ProjectsModule,
    DashboardModule,
  ],
})
export class AppModule {}
