import { getRepository } from 'typeorm';

import Funcionarios from '../models/Funcionarios';

interface Request {
  name: string;
  funcao: string;
  departamento: string;
  email: string;
  telefone: string;
  foto: string;
}

interface FuncionarioResponse {
  id: string;
  name: string;
  funcao: string;
  departamento: string;
  email: string;
  telefone: string;
  foto: string;
  like: number;
  deslike: number;
  created_at: Date;
  updated_at: Date;
}

class FuncionariosController {
  public async store({
    name,
    funcao,
    departamento,
    email,
    telefone,
    foto
  }: Request): Promise<FuncionarioResponse> {
    const funcionariosRepository = getRepository(Funcionarios);
    const verificaFuncionarioExiste = await funcionariosRepository.findOne({
      where: { email },
    });

    if (verificaFuncionarioExiste) {
      throw new Error('Email do funcionário já cadastrado');
    }

    const funcionario = funcionariosRepository.create({
      name,
      funcao,
      departamento,
      email,
      telefone,
      foto
    });

    await funcionariosRepository.save(funcionario);

    return funcionario;
  }
}

export default FuncionariosController;
