import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique
} from "typeorm";
import { IsNotEmpty, IsInt, IsNumber, Min, Max } from "class-validator";
import { KpopSongs } from "./kpop_songs";

@Entity({ name: "tb_user_progress" })
@Unique("UNI_tb_user_progress_userID_songID", ["userID", "songID"])
@Index("IDX_tb_user_progress_userID", ["userID"])
export class UserProgress {
    @PrimaryGeneratedColumn()
    public progressID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public userID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public songID!: number;

    @Column({ type: "int", default: 0 })
    @IsInt()
    @Min(0)
    public lastContentOrder!: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    @IsNumber()
    @Min(0)
    @Max(100)
    public completionRate!: number;

    @Column({ type: "datetime", nullable: true })
    public lastAccessDate?: Date;

    @CreateDateColumn({ type: "datetime" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    public updatedAt!: Date;

    @ManyToOne(() => KpopSongs, (song) => song.userProgresses, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "songID" })
    public song!: KpopSongs;
}