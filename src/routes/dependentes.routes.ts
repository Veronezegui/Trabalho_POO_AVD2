import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';
import DependentesController from '../app/controllers/DependentesController';
import Dependentes from '../app/models/Dependentes';
import { deletarFoto } from '../config/deletarFoto';

const dependentesRouter = Router();
const upload = multer(uploadConfig);

dependentesRouter.post('/',  upload.single('foto'), async (request, response) => {
  try {
    const { name, data_nasc, grau_parentesco, id_func} = request.body;
    const dependentesController = new DependentesController();
    const dependente = await dependentesController.update({
      name,
      data_nasc,
      grau_parentesco,
      foto: request.file.filename,
      id_func
    });
    return response.json(dependente);
  } catch (erro) {
    return response.status(400).json({ error: erro.message });
  }
});


dependentesRouter.get('/', async (request, response) => {
  const dependentesRepositorio = getRepository(Dependentes);
  const dependente = await dependentesRepositorio.find({select: ['id','name', 'data_nasc', 'grau_parentesco', 'foto', 'id_func']});
  return response.json(dependente);
});  

dependentesRouter.get('/:id', async (request, response) => {
  try {
    const dependentesRepositorio = getRepository(Dependentes);
    const {id} = request.params
    const dependente = await dependentesRepositorio.findOne(id, {select: ['name', 'data_nasc', 'grau_parentesco', 'foto', 'id_func']});
    return response.json(dependente);
  } catch (erro) {
    return response.json({ error: erro.message });
  }
});  

dependentesRouter.delete('/:id', async (request, response) => {
  try {
    const dependentesRepositorio = getRepository(Dependentes);
    const { id } = request.params;
    await dependentesRepositorio.delete(id);
    return response.send();
  } catch (erro) {
    return response.json({ error: erro.message });
  }
});

dependentesRouter.put('/:id', upload.single('foto'), async (request, response) => {
  try {
    const {name, data_nasc} = request.body;

    const dependentesRepositorio = getRepository(Dependentes);
    const { id } = request.params;
    const dependente = await dependentesRepositorio.findOne(id);
    if (!dependente) {
      return response.json({ message: 'Dependente não encontrado' });
    }

    await deletarFoto(dependente.foto);

    dependente.name = name;
    dependente.data_nasc = data_nasc;
    dependente.foto = request.file.filename;
    
    await dependentesRepositorio.save(dependente);
    return response.json(dependente);
  } catch (erro){
    return response.json({ error: erro.message})
  }
});

dependentesRouter.get('/funcionarios/:id', async (request, response) => {
  const dependentesRepositorio = getRepository(Dependentes);
  const { id } = request.params;
  const dependentes = await dependentesRepositorio.find({
    id_func: id
  })
  return response.json(dependentes);
})

export default dependentesRouter;