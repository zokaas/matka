// src/activity.entity.ts - OPTIMIZED WITH BETTER INDEXES
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Users } from './user.entity';
import { Comment } from './comment.entity';
import { Reaction } from './reaction.entity';

@Entity()
// OPTIMIZED: Composite indexes for common query patterns
@Index(['date', 'id']) // For sorting in getRecentActivities
@Index(['userId', 'date']) // For user-specific queries with date
@Index(['date']) // For date-only filtering
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // Index on activity type for filtering
  activity: string;

  @Column()
  duration: number;

  @Column()
  @Index() // Index on date for sorting and filtering
  date: string;

  @Column('float')
  kilometers: number;

  @Column('varchar', { nullable: true })
  bonus: string | null;

  @Column()
  @Index() // Index on userId for joins
  userId: number;

  @ManyToOne(() => Users, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(() => Comment, (comment) => comment.activity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.activity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reactions: Reaction[];
}
