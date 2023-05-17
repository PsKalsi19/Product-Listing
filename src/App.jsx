
import { useReducer } from 'react';
import './App.css'

import faker from "faker";
import { ACTIONS } from './ACTIONS';

faker.seed(123);

const data = [...Array(50)].map(() => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale"
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior"
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional"
  ]),
  color: faker.commerce.color()
}));


const reducerFn = (state, actions) => {
  switch (actions.type) {
    case ACTIONS.SEARCH:
      return { ...state, searchText: actions.payload }

    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: actions.payload }

    case ACTIONS.CLEAR_SEARCH:
      return { ...state, searchText: '' }

    case ACTIONS.SORT_BY:
      return { ...state, sorting: actions.payload }

    case ACTIONS.INCLUDE_OUT_OF_STOCK:
      return { ...state, includeOutOfStock: !state.includeOutOfStock }

    case ACTIONS.FAST_DELIVERY:
      return { ...state, fastDelivery: !state.fastDelivery }


    case ACTIONS.CLEAR_FILTERS:
      return initialState
  }

}

const initialState = {
  products: [...data],
  sorting: '',
  includeOutOfStock: true,
  fastDelivery: false,
  searchText: ''
}

function App() {
  const [state, dispatch] = useReducer(reducerFn, initialState)

  const searchClickHandler = () => {
    const filteredData = state.products.filter(product => product.name.toLowerCase().includes(state.searchText.toLowerCase()))
    dispatch({ type: ACTIONS.SET_PRODUCTS, payload: filteredData });
    dispatch({ type: ACTIONS.CLEAR_SEARCH, payload: '' })
  }
  return (
    <main>
      <h2>Practice Set 11</h2>
      <div>
        <label htmlFor="nameSearch">Search:</label> <input type="text" id='nameSearch' onChange={(e) => dispatch({ type: ACTIONS.SEARCH, payload: e.target.value })} value={state.searchText} />
        <button disabled={state.searchText === ''} type='button' onClick={searchClickHandler}>Search</button>
      </div>

      <div>
        <button type='button' onClick={() => { dispatch({ type: ACTIONS.CLEAR_FILTERS, payload: '' }) }}>Clear</button>
      </div>

      <fieldset>
        <legend>Sort By</legend>
        <input type="radio" checked={state.sorting==='desc'} value="desc" onClick={(e) => dispatch({ type: ACTIONS.SORT_BY, payload: e.target.value })} name="sortby" id="desc" /> <label htmlFor="desc">Price - High to Low</label>
        <input type="radio" checked={state.sorting==='asc'} value="asc" onClick={(e) => dispatch({ type: ACTIONS.SORT_BY, payload: e.target.value })} name="sortby" id="asc" /> <label htmlFor="asc">Price - Low to High</label>
      </fieldset>
      <fieldset>
        <legend>Filters</legend>
        <input type="checkbox" onChange={(e) => dispatch({ type: ACTIONS.INCLUDE_OUT_OF_STOCK, payload: e.target.checked })} checked={state.includeOutOfStock} name="outOfStock" id="outOfStock" /> <label htmlFor="outOfStock">Include Out Of Stock</label>
        <input type="checkbox" onChange={(e) => dispatch({ type: ACTIONS.FAST_DELIVERY, payload: e.target.checked })} checked={state.fastDelivery} name="fastDelivery" id="fastDelivery" /> <label htmlFor="fastDelivery">Fast Delivery Only</label>
      </fieldset>


      <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredAndSortedData(state).map(
          ({
            id,
            name,
            image,
            price,
            productName,
            inStock,
            level,
            fastDelivery
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid #4B5563",
                borderRadius: "0 0 0.5rem 0.5rem",
                margin: "1rem",
                maxWidth: "40%",
                padding: "0 0 1rem"
              }}
            >
              <img src={image} width="100%" height="auto" alt={productName} />
              <h3> {name} </h3>
              <div>Rs. {price}</div>
              {inStock && <div style={{ color: 'green' }}> In Stock </div>}
              {!inStock && <div style={{
                color: 'red'
              }}> Out of Stock </div>}
              <div>{level}</div>
              {fastDelivery ? (
                <div> Fast Delivery </div>
              ) : (
                <div> 3 days minimum </div>
              )}
            </div>
          )
        )}
      </div>
    </main>
  )
}


const filteredAndSortedData = ({ products, sorting, includeOutOfStock, fastDelivery }) => {
  let productsData = products;

  if (!includeOutOfStock) {
    productsData = productsData.filter(({ inStock }) => inStock)
  }
  if (fastDelivery) {
    productsData = productsData.filter(({ fastDelivery }) => fastDelivery)
  }
  if (sorting !== '') {
    productsData = productsData.sort((a, b) => sorting === 'asc' ? a.price - b.price : b.price - a.price)
  }

  return productsData
}

export default App
