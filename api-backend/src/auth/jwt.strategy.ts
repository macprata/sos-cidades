import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SOS_CIDADES_SECRET_KEY_2026',
    });
  }

  // Se o token for válido, o NestJS chama essa função.
  // O retorno dela vira a variável "req.user" nas rotas protegidas!
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, perfil: payload.perfil };
  }
}
