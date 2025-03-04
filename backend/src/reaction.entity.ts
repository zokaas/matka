import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: string; // "like", "support", "celebrate", etc.

  @ManyToOne(() => Activity, (activity) => activity.reactions, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
