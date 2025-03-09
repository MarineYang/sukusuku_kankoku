import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Index,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_purchase" }) // Table 이름, 하위 내용은 컬럼
@Unique("UNI_tb_purchase_purchaseID", ["purchaseID"])
@Index("IDX_tb_purchase_productID_language", ["productID", "language"])
export class Purchase {
    @PrimaryColumn({ type: "varchar", length: 255 })
    @IsNotEmpty()   
    public purchaseID!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public productID!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public language!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public duration!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public price!: string;

    @Column({ type: "varchar", length: 255 })
    @IsNotEmpty()
    public status!: string;

    @CreateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public createdAt!: Date;

    @UpdateDateColumn({ type: "datetime" })
    @IsNotEmpty()
    public updatedAt!: Date;
    
    
}