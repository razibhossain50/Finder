import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Biodata } from '../biodata/biodata.entity';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @Column()
  buyerId: number;

  @ManyToOne(() => Biodata)
  @JoinColumn({ name: 'biodataId' })
  biodata: Biodata;

  @Column()
  biodataId: number;

  @Column({ default: 1 })
  tokensUsed: number; // Number of tokens spent for this connection

  @Column({ default: 'active' })
  status: string; // 'active', 'expired'

  @CreateDateColumn()
  createdAt: Date;
}