import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from "typeorm";
import { IsNotEmpty, IsInt, IsEnum, Min, Max } from "class-validator";
import { KpopSongs } from "./kpop_songs";

export enum ContentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity({ name: "tb_learning_contents" })
@Index("IDX_tb_learning_contents_songID_contentOrder", ["songID", "contentOrder"])
export class LearningContent {
    @PrimaryGeneratedColumn()
    public contentID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public songID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(10) // 최대 10일치 콘텐츠 가정
    public contentOrder!: number;

    @Column({ type: "text" })
    @IsNotEmpty()
    public selectedLyrics!: string;

    @Column({ type: "text" })
    @IsNotEmpty()
    public japaneseTranslation!: string;

    @Column({ type: "text" })
    @IsNotEmpty()
    public pronunciation!: string;

    @Column({ type: "json" })
    @IsNotEmpty()
    public vocabularyList!: {
        word: string;
        pronunciation: string;
        meaning: string;
    }[];

    @Column({ type: "json" })
    @IsNotEmpty()
    public grammarPoints!: {
        pattern: string;
        explanation: string;
    }[];

    @Column({
        type: "enum",
        enum: ContentStatus,
        default: ContentStatus.ACTIVE
    })
    @IsEnum(ContentStatus)
    public status!: ContentStatus;

    @CreateDateColumn({ type: "datetime" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    public updatedAt!: Date;

    @ManyToOne(() => KpopSongs, (song) => song.learningContents, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "songID" })
    public song!: KpopSongs;
} 