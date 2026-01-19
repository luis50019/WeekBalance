import { AuthRepository } from "./auth.repository";
import { CreateAuthDto } from "./dto/create-auth.dto";


export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}

  createProfile(
    dto: CreateAuthDto,
  ) {
    if (dto.full_name == '' || dto.id == '') {
      throw new Error("Los datos estan incompletos");
    }
    return this.repo.create({
      ...dto
    });
  }

  getProfile(user_id:string){
    if(user_id == ""){
      throw new Error("usuario no existente");
    }
    return this.repo.findByID(user_id);
  }

}
