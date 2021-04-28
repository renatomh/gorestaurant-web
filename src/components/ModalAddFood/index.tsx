import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
}

// Implementaçao do modal para a inserção de pratos
const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  // Função para fechar o modal a partir do mesmo
  setIsOpen,
  // Função a ser chamada no Dashboard
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  // Função a ser chamada quando clicar no botão de envio de formulário do modal
  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {
      // Chamando a função que foi passada pela página que instanciou o modal/componente
      handleAddFood(data);
      // Fechamos ainda o modal
      setIsOpen();
    },
    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
