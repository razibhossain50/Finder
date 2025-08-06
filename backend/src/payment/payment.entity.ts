import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    tokens: number; // Number of connection tokens purchased

    @Column()
    paymentMethod: string; // 'bkash', 'nagad', etc.

    @Column()
    transactionId: string;

    @Column()
    bkashTransactionId: string;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'completed', 'failed', 'refunded'

    @Column('json', { nullable: true })
    paymentDetails: any; // Store bKash response details

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}