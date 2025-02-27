import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number; // ✅ Use 'id' instead of 'activityId'

  @Column()
  text: string;

  @ManyToOne(() => Activity, (activity) => activity.comments, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date; // ✅ Ensure this field exists
}
