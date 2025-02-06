import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>, // Inject the user repository
  ) {}

  @Get()
  getHome() {
    return { message: 'Welcome to the Matka Backend API' };
  }

  @Get('/health')
  getHealth() {
    return { status: 'Healthy', uptime: process.uptime() };
  }

  @Get('/total-kilometers')
  async getTotalKilometers() {
    try {
      const users = await this.userRepository.find(); // Fetch users from the database
      const totalKm = users.reduce((sum, user) => sum + (user.totalKm || 0), 0); // Calculate total kilometers
      return { totalKm }; // Return the result
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
