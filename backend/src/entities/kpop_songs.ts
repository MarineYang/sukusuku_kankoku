import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { IsNotEmpty, IsOptional, IsDate, IsUrl } from "class-validator";

@Entity({ name: "tb_kpop_songs" })
@Index("IDX_tb_kpop_songs_artist_songName", ["artist", "songName"])
export class KpopSongs {
    @PrimaryGeneratedColumn()
    public songID!: number;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public songName!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public artist!: string;

    @Column({ type: "date", nullable: true })
    @IsOptional()
    @IsDate()
    public releaseDate?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    @IsOptional()
    @IsUrl()
    public youtubeLink?: string;

    @CreateDateColumn({ type: "datetime" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    public updatedAt!: Date;
} 