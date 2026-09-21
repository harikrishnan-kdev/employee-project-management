import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getStats() {
    const [
        totalEmployeesRes, 
        activeEmployeesRes, 
        totalProjectsRes, 
        activeProjectsRes
    ] = await Promise.all([
        this.db.sql`SELECT COUNT(*) FROM employee`,
        this.db.sql`SELECT COUNT(*) FROM employee WHERE status = 'Active'`,
        this.db.sql`SELECT COUNT(*) FROM project`,
        this.db.sql`SELECT COUNT(*) FROM project WHERE status = 'Active'`
    ]);

    return {
      totalEmployees: parseInt(totalEmployeesRes[0].count, 10),
      activeEmployees: parseInt(activeEmployeesRes[0].count, 10),
      totalProjects: parseInt(totalProjectsRes[0].count, 10),
      activeProjects: parseInt(activeProjectsRes[0].count, 10),
    };
  }
}