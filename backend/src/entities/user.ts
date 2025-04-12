import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Index,
    PrimaryColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_user" }) // Table 이름, 하위 내용은 컬럼
@Unique("UNI_tb_user_lineUserID", ["lineUserID"])
@Index("IDX_tb_user_lineUserID", ["lineUserID"])
export class User {
    @PrimaryColumn({ type: "varchar", length: 255 })
    public lineUserID!: string;

    @Column({ type: "varchar", length: 255 })
    public displayName!: string;

    // @Column({ type: "varchar", length: 255 })
    // @IsNotEmpty()
    // public phone_number!: string;

    @Column({ type: "boolean" })
    @IsNotEmpty()
    public isFollow!: boolean;

    @Column({ type: "boolean", default: false })
    public isPayed!: boolean;

    @CreateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public updatedAt!: Date;
}