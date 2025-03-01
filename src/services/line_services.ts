// import { Inject, Service } from "typedi";
// import { InjectRepository } from "typeorm-typedi-extensions";


// @Service()
// export class AuthService {
//   @Inject()
//   private oauthGoogle: OAuthAccess;

//   @Inject()
//   private serviceUser: UserService;

//   @Inject('DefineData')
//   private dt_Define: DefineData;

//   @Inject('ShowroomListData')
//   private dt_ShowroomList: ShowroomListData;

//   constructor(
//     @InjectRepository() private accountRepository: AccountRepository,
//     @InjectRepository() private walletRepository: WalletRepository,
//     @InjectRepository() private repositoryUserProfile: ProfileRepository
//   ) { }