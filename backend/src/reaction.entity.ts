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
@Index(['activity', 'type']) // For type-specific queries
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Activity, (activity) => activity.reactions, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
