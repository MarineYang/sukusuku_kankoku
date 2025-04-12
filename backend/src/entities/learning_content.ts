import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";

@Entity({ name: "tb_learning_contents" })
@Index("IDX_tb_learning_contents_songID", ["songID"])
export class LearningContent {
    @PrimaryGeneratedColumn()
    public contentID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public songID!: number;

    @Column({ type: "text", comment: "뽑힌 가사 문장" })
    @IsNotEmpty()
    public selectedLyrics!: string;

    @Column({ 
        type: "mediumtext", 
        nullable: true,
        comment: "포맷팅된 학습 콘텐츠 "
    })
    public formattedContent?: string;

    @CreateDateColumn({ type: "datetime" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    public updatedAt!: Date;

} 