import { useEffect } from 'react';
import { API } from 'aws-amplify';
import { listRecipes } from './graphql/queries';
import { createRecipe } from './graphql/mutations';
import config from './aws-exports';
import './App.css';
import { onCreateRecipe } from './graphql/subscriptions';

function App() {

  useEffect(() => {
    const pullData = async () => {
      const data = await API.graphql({ query: listRecipes });
      console.log('data', data);
    };
    pullData();

    const subscription = API.graphql({
      query: onCreateRecipe
    }).subscribe({
      next: recipeData => {
        pullData();
      },
      error: (err) => {
        console.log('err: ', err);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createNewRecipe = async () => {
    const name = prompt('name your recipe friend');
    const newRecipe = await API.graphql({
      query: createRecipe,
      variables: { input: { name } }
    });
  };
  return (
    <div className="App">
      <button onClick={createNewRecipe}>Create new recipe</button>
    </div>
  );
}

export default App;
