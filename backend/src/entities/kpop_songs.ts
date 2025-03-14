import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Index,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_kpop_songs" }) // Table 이름, 하위 내용은 컬럼
@Unique("UNI_tb_kpop_songs_songID", ["songID"])
@Index("IDX_tb_kpop_songs_songID", ["songID"])
export class KpopSongs {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()   
    public songID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    public artistID!: number;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public songName!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public artist!: string;

    @Column({ type: "text" })
    @IsNotEmpty()
    public lyrics!: string;

    @CreateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public updatedAt!: Date;
}