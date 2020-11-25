import {getRepository} from 'typeorm';
import path from 'path';
import fs from 'fs';
import Dependentes from '../models/Dependentes';

const tmpFolder = path.resolve(__dirname, '..', '..', '..', 'tmp');

interface Request {
    name: string;
    data_nasc: string;
    grau_parentesco: string;
    foto: string;
    id_func: string;
}

class DependentesController {
    public async update({
        name,
        data_nasc,
        grau_parentesco,
        foto,
        id_func,
    }:Request): Promise<Dependentes> {
        const DependentesRepository = getRepository(Dependentes);
        const dependente = DependentesRepository.create({
            name,
            data_nasc,
            grau_parentesco,
            foto,
            id_func
        });
        if(dependente.foto) {
            const dependenteFotoFilePath = path.join(
                tmpFolder,
                dependente.foto,
            );
            const dependenteFotoFileExist = await fs.promises.stat(
                dependenteFotoFilePath,
            );
            console.log(dependenteFotoFileExist);
             if (dependenteFotoFileExist) {
              await fs.promises.unlink(dependenteFotoFilePath);
            }
        }
        dependente.foto = foto;
        
        await DependentesRepository.save(dependente);

        return dependente;

    }
}

export default DependentesController;