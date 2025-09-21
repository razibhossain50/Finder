import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Biodata } from '../biodata/biodata.entity';

@Entity('favorites')
@Unique(['userId', 'biodataId']) // Prevent duplicate favorites
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  biodataId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Biodata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'biodataId' })
  biodata: Biodata;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}