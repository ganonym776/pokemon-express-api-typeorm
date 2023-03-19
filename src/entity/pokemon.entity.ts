import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserPokemonEntity } from "./user.entity"

@Entity("pokemon")
export class PokemonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => UserPokemonEntity, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserPokemonEntity

    @Column()
    user_id: string

    @Column()
    poke_id: string

    @Column()
    poke_init_name: string

    @Column()
    poke_name: string

    @Column()
    poke_image: string
    
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    caught_at: Date

    @Column({ type: 'timestamptz', nullable: true })
    release_at: Date

    @Column()
    name_changed: number
}