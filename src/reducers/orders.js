import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

export default (state = [], action) => {
  switch (action.type) {
    case CREATE_NEW_ORDER:
      return [
          ...state,
        {
          'id': action.payload.id,
          'ingredients': [],
          'position': 'clients',
          'recipe': action.payload.recipe
        }
      ];
    case MOVE_ORDER_NEXT:
      return state.map((order) => {
        let position = ''

        if (order.id === action.payload) {
          const numberPosition = order.position !== 'clients' ? +order.position[order.position.length - 1] : null;

          if (order.position === 'clients') {
            position = `conveyor_1`

          } else if (+order.position[order.position.length - 1] === 4 ) {
            const isPizzaCompleted = order.recipe.every((ingredientInRecipe) => {
              return order.ingredients.includes(ingredientInRecipe)
            })

            isPizzaCompleted ? position = `finish` :
                               position = `conveyor_${numberPosition}`
          } else {
            position = `conveyor_${numberPosition + 1}`
          }

          return {
            ...order,
            position: position
          }
        }

        return order;
      })
    case MOVE_ORDER_BACK :
      return state.map((order) => {
        let position = '';

        if (order.id === action.payload) {
          const numberPosition = order.position === 'clients' ? 0 : +order.position[order.position.length - 1]

          position = `conveyor_${(numberPosition - 1 > 0) ? numberPosition - 1 : 1 }`

          return {
            ...order,
            position: position
          }
        }

        return order;
      })
    case ADD_INGREDIENT :
      let isAdded = false;

      return state.map((order) => {
        if (isAdded) { return order }

        if (order.position === action.payload.from &&
            order.recipe.includes(action.payload.ingredient) &&
            !order.ingredients.includes(action.payload.ingredient)) {
          return {
            ...order,
            ingredients: [
              ...order.ingredients,
              action.payload.ingredient
            ]
          }
        }

        return order
      })
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
