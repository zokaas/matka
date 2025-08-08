import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Comment } from './comment.entity';
import { Reaction } from './reaction.entity';

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

  @Column()
  userId: number;

  @ManyToOne(() => Users, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(() => Comment, (comment) => comment.activity)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.activity)
  reactions: Reaction[];
}
