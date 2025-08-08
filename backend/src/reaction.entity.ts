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
// OPTIMIZED: Composite indexes for common query patterns
@Index(['activityId', 'type']) // For type-specific queries per activity
@Index(['activityId', 'createdAt']) // For activity-based queries with sorting
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 }) // Limit type length
  @Index() // Index on type for filtering
  type: string;

  @Column()
  @Index() // Index on activityId for faster joins
  activityId: number;

  @ManyToOne(() => Activity, (activity) => activity.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index() // Index on createdAt for sorting
  createdAt: Date;
}
