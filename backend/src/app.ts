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
import cors from 'cors';
import DailyOpenAiCron from "./cron/open_ai_cron";
import { UserRepository } from './repository/user_repository';
import { createExpressServer } from 'routing-controllers';
import { LineWebhookController } from './controllers/line_webhook_controller';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string = 'development';
  private openAiCron?: DailyOpenAiCron;

  constructor() {
    this.app = express();
    this.port = env.app.port;
    Container.set('logger', logger);
    
  }

  public async Init(): Promise<boolean> {
    logger.info('Create Server start');
    let resMap: Map<string, boolean> = new Map<string, boolean>()
    this.InitializeMiddleweres();
    // this.initializeRoutes();
    let res = true

    resMap.set(this.initConnectionDB.name, await this.initConnectionDB())
    // resMap.set(this.InitRedis.name, await this.InitRedis())

    // this.initializeErrorHandling();
    
    const userRepository = Container.get(UserRepository);
    this.openAiCron = new DailyOpenAiCron(userRepository);
    this.openAiCron.startDailyScheduler();

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
    this.app.use((req, res, next) => {
      res.setHeader('ngrok-skip-browser-warning', 'true');
      next();
    });
    this.app.use(cors({
      origin: '*',
      credentials: true
    }));

  }

  public async initializeRoutes(): Promise<void> {
    try {
      logger.info('initServer start');

      const res = await this.Init()
      if (false == res) { throw new Error("[ ERROR ] Server Init Failed") }

      routingUseContainer(Container);

      const lineController = Container.get(LineWebhookController);
      this.app.post('/api/line/webhook', (req, res) => {
        console.log('Line 웹훅 요청 수신 (수동 라우트)');
        lineController.handleWebhook(req, res);
      });

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

    // 기본 경로 설정
    this.app.get('/', (req, res) => {
      res.send('Server is running');
    });
  }

  private GenerationEnumSchemaObject(enumType: typeof EResultCode) {
    // const enumDatas = Object.keys(enumType).
    // filter(key => isNaN(Number(key))).
    // map((key) => ({ 
    // name: key, 
    // value: "{ \"type\": \"number\", \"default\": \"" + EResultCode[key as any] + "\", \"description\": \"" + EResultCode_Description.get(enumType[key]) + "\" }" }));
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

    // 객체를 직접 생성
    const properties = enumDatas.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {} as Record<string, any>);
  
    const schemaObj: SchemaObject = {
      properties,
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
