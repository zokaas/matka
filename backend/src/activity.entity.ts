import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './user.entity';

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
}
