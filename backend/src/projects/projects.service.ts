import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createProjectDto: any) {
    const { name, description, startDate, endDate, status } = createProjectDto;
    const result = await this.db.sql`
      INSERT INTO project (name, description, "startDate", "endDate", status)
      VALUES (${name}, ${description}, ${startDate}, ${endDate || null}, ${status || 'Active'})
      RETURNING *
    `;
    return result[0];
  }

  async findAll(status?: string) {
    if (status) {
      return this.db.sql`SELECT * FROM project WHERE status = ${status} ORDER BY id DESC`;
    }
    return this.db.sql`SELECT * FROM project ORDER BY id DESC`;
  }

  async findOne(id: number) {
    const projects = await this.db.sql`SELECT * FROM project WHERE id = ${id}`;
    if (projects.length === 0) throw new NotFoundException('Project not found');
    
    const employees = await this.db.sql`
      SELECT e.* FROM employee e
      JOIN project_members pm ON pm."employeeId" = e.id
      WHERE pm."projectId" = ${id}
    `;
    
    return { ...projects[0], employees };
  }

  async update(id: number, updateProjectDto: any) {
    const { name, description, startDate, endDate, status } = updateProjectDto;
    const result = await this.db.sql`
      UPDATE project 
      SET name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          "startDate" = COALESCE(${startDate}, "startDate"),
          "endDate" = COALESCE(${endDate}, "endDate"),
          status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) throw new NotFoundException('Project not found');
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db.sql`DELETE FROM project WHERE id = ${id} RETURNING id`;
    if (result.length === 0) throw new NotFoundException('Project not found');
  }

  async assignEmployee(projectId: number, employeeId: number) {
    // Check if project exists
    await this.findOne(projectId);
    
    // Insert if not exists
    await this.db.sql`
      INSERT INTO project_members ("projectId", "employeeId")
      VALUES (${projectId}, ${employeeId})
      ON CONFLICT DO NOTHING
    `;
    return this.findOne(projectId);
  }

  async removeEmployee(projectId: number, employeeId: number) {
    await this.db.sql`
      DELETE FROM project_members 
      WHERE "projectId" = ${projectId} AND "employeeId" = ${employeeId}
    `;
    return this.findOne(projectId);
  }
}