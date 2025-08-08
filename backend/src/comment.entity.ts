// src/comment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
@Index(['activity']) // For faster activity-based queries
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Activity, (activity) => activity.comments, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;
}
