// src/comment.entity.ts - OPTIMIZED
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
// OPTIMIZED: Composite index for activity-based queries with sorting
@Index(['activityId', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text') // Use TEXT for potentially longer comments
  text: string;

  @Column()
  @Index() // Index on activityId for faster joins
  activityId: number;

  @ManyToOne(() => Activity, (activity) => activity.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @CreateDateColumn()
  @Index() // Index on createdAt for sorting
  createdAt: Date;
}
