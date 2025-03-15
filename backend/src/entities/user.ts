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

@Entity({ name: "tb_user" }) // Table 이름, 하위 내용은 컬럼
@Unique("UNI_tb_user_userID", ["userID"])
@Index("IDX_tb_user_userID", ["userID"])
export class User {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()   
    public userID!: number;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public lineUserID!: number;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public phone_number!: string;

    @Column({ type: "boolean" })
    @IsNotEmpty()
    public isPayed!: boolean;

    @CreateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public updatedAt!: Date;
}