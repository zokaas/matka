import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('users') // Explicit table name
@Index(['username']) // Unique username index
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 }) // Limit username length
  @Index() // Explicit index on username
  username: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 }) // Use DECIMAL for precise calculations
  totalKm: number;

  @Column({ nullable: true, length: 255 }) // Limit profile picture path length
  profilePicture: string;

  @OneToMany(() => Activity, (activity) => activity.user, {
    cascade: true,
    lazy: true, // Lazy load activities to avoid N+1 issues
  })
  activities: Activity[];
}
