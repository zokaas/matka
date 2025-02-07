import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column('float', { default: 0 })
  totalKm: number;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @Column({ nullable: true }) // Allow null values initially
  profilePicture: string;

}
