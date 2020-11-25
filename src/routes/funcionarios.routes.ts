import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';
import FuncionariosController from '../app/controllers/FuncionariosController';
import Funcionarios from '../app/models/Funcionarios';  
import { deletarFoto } from '../config/deletarFoto';

const funcionariosRouter = Router();
const upload = multer(uploadConfig);


funcionariosRouter.post('/', upload.single('foto'), async (request, response) => {
  try {
    const { name, funcao, departamento, email, telefone} = request.body;

    const funcionariosController = new FuncionariosController();
    const funcionario = await funcionariosController.store({
      name,
      funcao,
      departamento,
      email,
      telefone,
      foto: request.file.filename
    });

    return response.json(funcionario);
  } catch (erro) {
    return response.status(400).json({ error: erro.message });
  }
});

funcionariosRouter.get('/', async (request, response) => {
  const funcionariosRepositorio = getRepository(Funcionarios);
  const funcionario = await funcionariosRepositorio.find({select: ['id','name', 'funcao', 'departamento', 'email', 'foto', 'like', 'deslike']});
  return response.json(funcionario);
});

funcionariosRouter.get('/:id', async (request, response) => {
  try {
    const funcionariosRepositorio = getRepository(Funcionarios);
    const { id } = request.params;
    const funcionario = await funcionariosRepositorio.findOne(id, {select: ['name', 'funcao', 'departamento', 'email', 'foto']});
    return response.json(funcionario);
  } catch (erro) {
    return response.json({ error: erro.message });
  }
});

funcionariosRouter.delete('/:id', async (request, response) => {
  try {
    const funcionariosRepositorio = getRepository(Funcionarios);
    const { id } = request.params;
    const funcionario = await funcionariosRepositorio.findOne(id);

    if (funcionario) {
      await deletarFoto(funcionario.foto);
  
      await funcionariosRepositorio.delete(id);
      return response.send();
    } else {
      return response.json({ message: 'Funcionário não encontrado' });
    }
  } catch (erro) {
    return response.json({ error: erro.message})
  }
});

funcionariosRouter.put('/:id', upload.single('foto'), async (request, response) => {
  try {
    const {name, funcao, departamento, email, telefone, foto } = request.body;

    const funcionariosRepositorio = getRepository(Funcionarios);
    const { id } = request.params;
    const funcionario = await funcionariosRepositorio.findOne(id);
    if (!funcionario) {
      return response.json({ message: 'Funcionário não encontrado' });
    }
  
    await deletarFoto(funcionario.foto);
  
    funcionario.name = name;
    funcionario.funcao = funcao;
    funcionario.departamento = departamento;
    funcionario.email = email;
    funcionario.telefone = telefone;
    funcionario.foto = request.file.filename;
    
    await funcionariosRepositorio.save(funcionario);
    return response.json(funcionario);
  } catch (erro) {
    return response.json({error: erro.message});
  }
});

funcionariosRouter.put('/like/:id', async (request, response) => {
  try {
    const funcionariosRepositorio = getRepository(Funcionarios);
    const { id } = request.params;
    const funcionario = await funcionariosRepositorio.findOne(id);
    if (!funcionario) {
      return response.json({ message: 'Funcionário não encontrado' });
    }
    funcionario.like = funcionario.like + 1
    
    await funcionariosRepositorio.save(funcionario);
    return response.json([`likes: ${funcionario.like}`]);
  } catch (erro) {
    return response.json({ error: erro.message});
  }
});

funcionariosRouter.put('/deslike/:id', async (request, response) => {
  try {
    const funcionariosRepositorio = getRepository(Funcionarios);
    const { id } = request.params;
    const funcionario = await funcionariosRepositorio.findOne(id);
    if (!funcionario) {
      return response.json({ message: 'Funcionário não encontrado' });
    }
    funcionario.deslike = funcionario.deslike + 1
    
    await funcionariosRepositorio.save(funcionario);
    return response.json(funcionario.deslike);
  } catch(erro) {
    return response.json({error: erro.message });
  }
});


export default funcionariosRouter;
