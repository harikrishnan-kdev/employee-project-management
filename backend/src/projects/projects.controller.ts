import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: any) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.projectsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Post(':id/employees/:employeeId')
  assignEmployee(@Param('id') id: string, @Param('employeeId') employeeId: string) {
    return this.projectsService.assignEmployee(+id, +employeeId);
  }

  @Delete(':id/employees/:employeeId')
  removeEmployee(@Param('id') id: string, @Param('employeeId') employeeId: string) {
    return this.projectsService.removeEmployee(+id, +employeeId);
  }
}