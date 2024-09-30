import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { productsAndPrices as products } from "../data/data";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../app/firebaseConfig";
 

interface CartItem {
  product: string;
  id: number;
  price: number;
  quantity: number;
  discount?: number; // Optional discount field
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};
 
// Async thunk to fetch cart items from Firestore
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const cartRef = collection(db, "cartItems");
    const snapshot = await getDocs(cartRef);
 
    if (snapshot.docs[0]) {
      const items = snapshot.docs.map((doc) => doc.data().items).flat() || [];
      localStorage.setItem("snapshotId", JSON.stringify(snapshot.docs[0].id));

      return items;
    } else {
      localStorage.removeItem("snapshotId");
      return [];
    }
  }
);

 
const saveCartItemsToFirestore = async (cartItems: CartItem[]) => {
  if (localStorage.getItem("snapshotId")) {
    let id = JSON.parse(localStorage.getItem("snapshotId") as string);
    const cartRef = doc(db, "cartItems", id);
    
    await updateDoc(cartRef, { items: cartItems });
  } else {
     
    const cartRef = collection(db, "cartItems");

    const docRef =await addDoc(cartRef, { items: cartItems });
   
    localStorage.setItem("snapshotId", JSON.stringify(docRef.id));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<string>) => {
      const product = products.find((item) => item.product === action.payload);
      if (product) {
        const existingItem = state.items.find(
          (item) => item.product === product.product
        );
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({
            id: product.id,
            product: product.product,
            price: Number(product.price),
            quantity: 1,
          });
        }
      }
      saveCartItemsToFirestore(state.items);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }
      saveCartItemsToFirestore(state.items);
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.loading = false;
          state.items = action.payload; 
        }
      )
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart items";
      });
  },
});

export const { addItemToCart, removeItem, setCartItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export default cartReducer;
