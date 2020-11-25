import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  import Funcionarios from './Funcionarios';
  
  @Entity('dependentes')
  class Treinamentos {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    data_nasc: string;

    @Column()
    grau_parentesco: string;

    @Column()
    foto: string;

    @Column()
    id_func: string;
    
    @ManyToOne(() => Funcionarios)
    @JoinColumn({name: 'id_func'})
    func: Funcionarios;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  
  export default Treinamentos;
  