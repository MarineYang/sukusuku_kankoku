import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Index,
    PrimaryColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_user_progress" }) // Table 이름, 하위 내용은 컬럼
@Unique("UNI_tb_user_progress_userID", ["userID"])
@Index("IDX_tb_user_progress_userID", ["userID"])
export class UserProgress {
    @PrimaryColumn()
    @IsNotEmpty()   
    public userID!: number;

    // 유저가 선택한 아티스트들
    @Column({ type: "json" })
    @IsNotEmpty()
    public selectedArtists!: number[];
    
    // 유저가 진행한 아티스트들
    @Column({ type: "json" })
    @IsNotEmpty()
    public progressArtistID!: number[];

    // 유저의 진도
    @Column({ type: "int" })
    @IsNotEmpty()
    public progressCount!: number;

    @CreateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public updatedAt!: Date;
}