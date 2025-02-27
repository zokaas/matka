import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Users } from './user.entity';
import { Comment } from './comment.entity';
import { Reaction } from './reaction.entity';

// activity.entity.ts
@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activity: string;

  @Column()
  duration: number;

  @Column()
  date: string;

  @Column('float')
  kilometers: number;

  @Column('varchar', { nullable: true })
  bonus: string | null;

  @ManyToOne(() => Users, (user) => user.activities)
  user: Users;

  @OneToMany(() => Comment, (comment) => comment.activity)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.activity)
  reactions: Reaction[];
}
