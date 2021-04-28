import React, { useState } from 'react';

import { FiEdit3, FiTrash } from 'react-icons/fi';
import api from '../../services/api';

import { Container } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IProps {
  food: IFoodPlate;
  handleDelete: (id: number) => {};
  handleEditFood: (food: IFoodPlate) => void;
}

const Food: React.FC<IProps> = ({
  // Recebemos os dados do prato a ser exibido/editado
  food,
  // Função para remover o prato (chamada no Dashboard)
  handleDelete,
  // Função a ser chamada no Dashboard
  handleEditFood,
}: IProps) => {
  const [isAvailable, setIsAvailable] = useState(food.available);

  // Função para alternar a disponibilidade do prato
  async function toggleAvailable(): Promise<void> {
    // Podemos fazer a chamada diretamente aqui, sem ter de utilizar uma função do 'Dashboard'
    try {
      await api.put(`/foods/${food.id}`, {
        // Passando os dados do prato
        ...food,
        // Invertendo o status atual de disponibilidade
        available: !isAvailable,
      });
      // Atualizando o status na página
      setIsAvailable(!isAvailable);
    } catch (err) {
      // Caso ocorra algum erro, apresentamos no console
      console.log(err);
    }
  }

  // Função para atribuir o ID e informações do prato e abrir o modal de edição
  function setEditingFood(): void {
    handleEditFood(food);
  }

  return (
    <Container available={isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={() => setEditingFood()}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
};

export default Food;
