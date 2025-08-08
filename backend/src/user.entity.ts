// src/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
@Index(['username']) // Explicit index for username searches
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Make sure this is unique
  username: string;

  @Column('float', { default: 0 })
  totalKm: number;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @Column({ nullable: true })
  profilePicture: string;
}
