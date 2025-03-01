import "reflect-metadata";
import express from 'express';
import bodyParser from "body-parser";
import { createDatabaseConnection } from "./db_connection";
import { Container } from "typedi";
import {
  useContainer as routingUseContainer,
  useExpressServer,
} from "routing-controllers";
import { routingControllerOptions } from "./utils/routing_config";
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'; // swagger 문서 자동화
import swaggerUi from 'swagger-ui-express';
import morgan from "morgan";
import errorMiddleware from './midlleware/error_middleware';
import { env } from './env'
import { logger, stream } from "./utils/logger";
import { EResultCode, EResultCode_Description } from "./enums/result_code";
import { SchemaObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string = 'development';

  constructor() {
    this.app = express();
    this.port = env.app.port;
    Container.set('logger', logger);
  }

  public async Init(): Promise<boolean> {
    logger.info('Create Server start');
    let resMap: Map<string, boolean> = new Map<string, boolean>()
    this.InitializeMiddleweres();
    this.initializeRoutes();
    let res = true

    resMap.set(this.initConnectionDB.name, await this.initConnectionDB())
    // resMap.set(this.InitRedis.name, await this.InitRedis())

    this.initializeErrorHandling();

    logger.info('Create Server start');

    resMap.forEach((val: boolean, key: string) => {
      if (false == val) { logger.error(`[ ERROR ] Server Init Failed - ${key}() in this init function`) }
      res = res && val
    })

    return res
  }

  /**
   * 미들웨어를 세팅
   */
  private InitializeMiddleweres(): void {


    this.app.get('/status', (req, res) => {
      res.status(200).end(); // Success init Server 상태 체크
    });

    this.app.head('/status', (req, res) => {
      res.status(200).end(); // Success init Server 상태 체크
    });

    logger.info(`=================================`);
    logger.info(`sukusuku listening on the port ${this.port}`);
    logger.info(`=================================`);

    if (this.env === 'production') {
      this.app.use(morgan('common'));
      //this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('dev'));
    }
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use(morgan("common", { stream }));
    // this.app.use(compression());  // 혹시 몰라 추가함.

  }

  public async initializeRoutes(): Promise<void> {
    try {
      logger.info('initServer start');

      const res = await this.Init()
      if (false == res) { throw new Error("[ ERROR ] Server Init Failed") }

      routingUseContainer(Container);

      useExpressServer(this.app, routingControllerOptions);
      this.initializeSwagger();
      this.app.listen(this.port, () => {
        logger.info(`Server is running on http://localhost:${this.port}`);
      });

    } catch (error) {
      logger.error(error);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSwagger() {

    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    schemas["EResultCode"] = this.GenerationEnumSchemaObject(EResultCode) as any;

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllerOptions, {
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'sukusuku API Server.',
        version: '1.0.0',
      },
      components: {
        schemas: schemas as any,
        securitySchemes: {
          bearerAuth: {
            scheme: 'bearer',
            type: 'http',
            bearerFormat: 'JWT'
          },
        },
      },

    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private GenerationEnumSchemaObject(enumType: typeof EResultCode) {
    // const enumDatas = Object.keys(enumType).filter(key => isNaN(Number(key))).map((key) => ({ name: key, value: "{ \"type\": \"number\", \"default\": \"" + EResultCode[key as any] + "\", \"description\": \"" + EResultCode_Description.get(enumType[key]) + "\" }" }));
    const enumDatas = Object.keys(enumType)
    .filter(key => isNaN(Number(key)))
    .map((key) => ({
      name: key,
      value: {
        type: "number",
        default: enumType[key as keyof typeof EResultCode],
        description: EResultCode_Description.get(enumType[key as keyof typeof EResultCode])
      }
    }));
    
    let strProperties = "{";

    for (let i = 0; i < enumDatas.length; ++i) {
      strProperties += "\"";
      strProperties += enumDatas[i].name;
      strProperties += "\": ";
      strProperties += enumDatas[i].value;
      if (i < enumDatas.length - 1) {
        strProperties += ",";
      }
    }

    strProperties += "}";

    let schemaObj: SchemaObject = {
      properties: JSON.parse(strProperties),
      type: 'object'
    };

    return schemaObj;
  }

  private async initConnectionDB(): Promise<boolean> {
    try {
      await createDatabaseConnection();
      logger.info("sukusuku DB Connection Success ! ");
      return true
    } catch (error) {
      logger.error("Error : ", error);
      return false
    }
  }

//   private async InitRedis() {
//     return await Redis.MakeAllConnection()
//   }

//   private async InitFirebase() {
//     return await FirebaseRequest.Init();
//   }
}




export default App;
