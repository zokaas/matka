// src/activity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activity: string;

  @Column()
  duration: number;

  @Column()
  date: string;

  @Column('float') // Change this line to 'float' to support decimal numbers
  kilometers: number;

  @ManyToOne(() => Users, (user) => user.activities)
  user: Users;
}
