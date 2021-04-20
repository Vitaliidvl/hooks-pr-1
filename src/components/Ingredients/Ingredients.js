import React, { useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';


const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
     default: 
     throw new Error('Should not get there!')     
  }
}


 

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();
 
   useEffect(() => {
     if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
       dispatch({type: 'DELETE', id: reqExtra })
     } else if (!isLoading && data && !error && reqIdentifier === 'ADD_INGREDIENT') {
       dispatch({
         type: "ADD",
         ingredient: {id: data.name, ...reqExtra}
       })
     }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filterIngredientHandler = useCallback((filteredIngredients) => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-practice-1-default-rtdb.firebaseio.com/ingredients.json',
    'POST',
    JSON.stringify(ingredient),
    ingredient,
    'ADD_INGREDIENT'
    )
   
  }, [sendRequest]);
  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-practice-1-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
     'DELETE',
     null,
     ingredientId,
     'REMOVE_INGREDIENT'
     )

    
  }, [sendRequest]);

  // const clearError = useCallback(() => {
  //   clear();
  // }, [clear]);

  const ingredientList = useMemo(() => {
      return( <IngredientsList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
        );
  }, [userIngredients, removeIngredientHandler])
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
       
      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
