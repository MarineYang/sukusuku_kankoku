import {
    IsNotEmpty, Length, IsEmail, IsNumber, IsString, IsBoolean, IsObject, IsArray,
    Validate, ValidateNested, IsDefined, IsNotEmptyObject, IsDate
} from "class-validator";
import { EResultCode, EResultCode_Description } from "../enums/result_code";
import { Type } from "class-transformer";

export class ReqPurchaseDto {
    @IsString()
    @IsNotEmpty()
    public productId: string | undefined;

    @IsString()
    @IsNotEmpty()
    public language: string | undefined;
    
    @IsString()
    @IsNotEmpty()
    public duration: string | undefined;

    @IsString()
    @IsNotEmpty()
    public price: string | undefined;    
}

export class ResPurchaseDto {
    @IsNotEmpty()
    public resultCode: EResultCode | undefined;

    @IsString()
    @IsNotEmpty()
    public checkoutUrl: string | undefined;
}