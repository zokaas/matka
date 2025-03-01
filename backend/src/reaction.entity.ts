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
  type: string;

  @ManyToOne(() => Activity, (activity) => activity.reactions, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;
}
