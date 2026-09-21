import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class EmployeesService {
  constructor(private readonly db: DatabaseService) {}

  async create(createEmployeeDto: any) {
    const { name, email, phone, department, designation, status } = createEmployeeDto;
    const result = await this.db.sql`
      INSERT INTO employee (name, email, phone, department, designation, status)
      VALUES (${name}, ${email}, ${phone}, ${department}, ${designation}, ${status || 'Active'})
      RETURNING *
    `;
    return result[0];
  }

  async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    const searchParam = `%${search}%`;
    
    const data = await this.db.sql`
      SELECT * FROM employee 
      WHERE name ILIKE ${searchParam} OR email ILIKE ${searchParam}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await this.db.sql`
      SELECT COUNT(*) as count FROM employee 
      WHERE name ILIKE ${searchParam} OR email ILIKE ${searchParam}
    `;

    return { data, total: parseInt(totalResult[0].count, 10) };
  }

  async findOne(id: number) {
    const employees = await this.db.sql`SELECT * FROM employee WHERE id = ${id}`;
    if (employees.length === 0) throw new NotFoundException('Employee not found');
    
    const projects = await this.db.sql`
      SELECT p.* FROM project p
      JOIN project_members pm ON pm."projectId" = p.id
      WHERE pm."employeeId" = ${id}
    `;
    
    return { ...employees[0], projects };
  }

  async update(id: number, updateEmployeeDto: any) {
    const { name, email, phone, department, designation, status } = updateEmployeeDto;
    const result = await this.db.sql`
      UPDATE employee 
      SET name = COALESCE(${name}, name),
          email = COALESCE(${email}, email),
          phone = COALESCE(${phone}, phone),
          department = COALESCE(${department}, department),
          designation = COALESCE(${designation}, designation),
          status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) throw new NotFoundException('Employee not found');
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db.sql`DELETE FROM employee WHERE id = ${id} RETURNING id`;
    if (result.length === 0) throw new NotFoundException('Employee not found');
  }
}