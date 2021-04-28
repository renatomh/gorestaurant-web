import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  // Estado para a lista de pratos recebidos da API
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  // Estado do prato atualmente sendo editado
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  // Definindo os estados para os modais de inserção e edição de pratos
  // Poderíamos usar o useToggle também: https://github.com/streamich/react-use/blob/master/docs/useToggle.md
  // Ele é parte do react-use, que consiste de vários hooks: https://github.com/streamich/react-use
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    // Função para carregar os pratos da API
    async function loadFoods(): Promise<void> {
      // Fazendo a chamada para leitura dos pratos na API ('R' do 'CRUD')
      // Definimos também o tipo de reposta esperada
      const response = await api.get<IFoodPlate[]>('/foods');
      setFoods(response.data);
    }

    // Chamando a função para carregar os pratos
    loadFoods();
  }, []);

  // Função para adicionar um novo prato
  async function handleAddFood(
    // Não recebemos o 'id' nem o 'available' no retorno, por isso omitimos esses na tipagem
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // Fazendo a chamada para inserção do prato na API ('C' do 'CRUD')
      const response = await api.post('/foods', {
        // Passando os dados recebidos via 'spread operator'
        ...food,
        // Adicionando ainda a disponibilidade para o prato
        available: true,
      });
      // Atualizando a lista de pratos na página
      setFoods([...foods, response.data]);
    } catch (err) {
      // Caso ocorra algum erro, apresentamos no console
      console.log(err);
    }
  }

  // Função para editar um prato
  async function handleUpdateFood(
    // Não recebemos o 'id' nem o 'available' no retorno, por isso omitimos esses na tipagem
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // Fazendo a chamada para atualização do prato na API ('U' do 'CRUD')
      // Passamos o ID do prato como parâmetro da requisição
      const response = await api.put<IFoodPlate>(`/foods/${editingFood.id}`, {
        // Adicionando a disponibilidade e o ID do prato sendo editado
        ...editingFood,
        // Passando os dados editados recebidos via 'spread operator'
        ...food,
      });
      // Atualizando a lista de pratos na página
      setFoods(
        foods.map(mappedFood =>
          // Caso o ID corresponda ao do prato editado, usamos a resposta da API
          // Caso contrário, utilizamos o prato já presente
          mappedFood.id == editingFood.id ? { ...response.data } : mappedFood
        ),
      );
    } catch (err) {
      // Caso ocorra algum erro, apresentamos no console
      console.log(err);
    }
  }

  // Função para remover um prato
  async function handleDeleteFood(id: number): Promise<void> {
    // Basta fazer a chamada à API com o ID do item
    try {
      // Fazendo a chamada para remoção do prato na API ('D' do 'CRUD')
      await api.delete(`/foods/${id}`);
      // Atualizando a lista de pratos na página
      setFoods(foods.filter(food => food.id != id));
    } catch (err) {
      // Caso ocorra algum erro, apresentamos no console
      console.log(err);
    }
  }

  // Função para abrir/fechar o modal de inserção de pratos
  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  // Função para abrir/fechar o modal de edição de pratos
  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  // Função para definir qual prato está sendo editado
  function handleEditFood(food: IFoodPlate): void {
    // Definindo o prato em edição
    setEditingFood(food);
    // Abrindo o modal para edição do prato
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      {/* Modal para a inserção de um prato */}
      <ModalAddFood
        // Parâmetro para verificar se o modal está aberto ou não
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        // Função a ser chamada para a inserção de um prato
        handleAddFood={handleAddFood}
      />
      {/* Modal para a edição de um prato */}
      <ModalEditFood
        // Parâmetro para verificar se o modal está aberto ou não
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        // Definindo o prato que está sendo editado
        editingFood={editingFood}
        // Função a ser chamada para a atualização de um prato
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              // Definindo a função a ser chamada para definir o ID do prato a ser modificado
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
