import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity("user_pokemon")
export class UserPokemonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    nama: string

    @Column({unique: true, select: false})
    username: string

    @Column({ select: false })
    password: string
    
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date
}