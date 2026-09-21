import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    public readonly sql;

    constructor(private configService: ConfigService) {
        const databaseUrl = this.configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
            console.warn('DATABASE_URL is not set!');
        }
        this.sql = neon(databaseUrl || 'postgresql://postgres:root@localhost:5432/employee_project_db');
    }
}
