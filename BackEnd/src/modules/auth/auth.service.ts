import { AuthRepository } from "./auth.repository";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { validate as isUUID } from "uuid";

export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}

  async createProfile(
    dto: CreateAuthDto,
  ) {
    if (dto.full_name == '' || dto.id == '') {
      console.log('error en el servicio');
      throw new Error("Los datos estan incompletos");
    }
    return await this.repo.create(dto.id, dto.full_name);
  }
  getProfile(user_id:string){
    if(!isUUID(user_id)){
      throw new Error("usuario no existente");
    }
    return this.repo.findByID(user_id);
  }

  getInfo(user_id:string){
    if(!isUUID(user_id)){
      throw new Error("usuario no existente");
    }
    return this.repo.getInfoUserByID(user_id);
  }

}
