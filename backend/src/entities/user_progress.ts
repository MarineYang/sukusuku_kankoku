import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Unique
} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";

@Entity({ name: "tb_user_progress" })
@Unique("UNI_tb_user_progress_lineUserID_songID", ["lineUserID", "songID"])
@Index("IDX_tb_user_progress_lineUserID", ["lineUserID"])
export class UserProgress {
    @PrimaryGeneratedColumn()
    public progressID!: number;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public lineUserID!: string;

    @Column({ type: "int" })
    @IsNotEmpty()
    @IsInt()
    public songID!: number;

    @Column({ type: "int", default: 0, comment: "마지막 콘텐츠 번호" })
    @IsInt()
    public lastContentOrder!: number; 

    @CreateDateColumn({ type: "datetime" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    public updatedAt!: Date;
}