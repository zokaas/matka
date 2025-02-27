import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { Users } from './user.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: string; // "like", "support", "celebrate"

  @ManyToOne(() => Activity, (activity) => activity.reactions, {
    onDelete: 'CASCADE',
  })
  activity: Activity;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' }) // ❌ Removed user.reactions reference
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}
