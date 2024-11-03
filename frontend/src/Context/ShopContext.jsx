import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import { query, onSnapshot, collection, getDoc,setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
}

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const userId = getCurrentUserId();
    if (userId) {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      return storedCart ? JSON.parse(storedCart) : {};
    }
    return {};
  });

  // Sync `cartItems` with local storage whenever it changes
  useEffect(() => {
    const userId = getCurrentUserId();
  
    if (userId) {
      const fetchCartItems = async () => {
        const cartDocRef = doc(db, "carts", userId);
        const cartDoc = await getDoc(cartDocRef);
        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items || {}); // Ensure it falls back to an empty object if not defined
        } else {
          setCartItems({});
        }
      };
  
      fetchCartItems();
    } else {
      // If no user is logged in, clear the cart
      setCartItems({});
    }
  }, [getCurrentUserId()]); // Listen for user ID changes
  

  // Update cart items from localStorage whenever user logs in
  // useEffect(() => {
  //   const userId = getCurrentUserId();
  //   if (userId) {
  //     const storedCart = localStorage.getItem(`cart_${userId}`);
  //     if (storedCart) {
  //       setCartItems(JSON.parse(storedCart));
  //     }
  //   }
  // }, [getCurrentUserId()]);

  useEffect(() => {
    const productRef = collection(db, "Products");
    const q = query(productRef);

    // Set up the onSnapshot listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all_product = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAll_Product(all_product);
    });

    // Cleanup function to unsubscribe from Firestore on unmount
    return () => unsubscribe();
  }, []);

  const addToCart = async (itemId) => {
    const updatedCart={
     ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };

    setCartItems(updatedCart);
    
    const userId = getCurrentUserId();
    if (userId) {
      await setDoc(doc(db, "carts", userId), { items: updatedCart });
    }
  };


  const removeFromCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: Math.max((cartItems[itemId] || 0) - 1, 0),
    };
  
    setCartItems(updatedCart); // Update local state
  
    const userId = getCurrentUserId();
    if (userId) {
      await setDoc(doc(db, "carts", userId), { items: updatedCart });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((product) => product.id === item);
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  // Clear cart on logout but keep it in localStorage for re-login
  const logout = () => {
    const userId = getCurrentUserId();
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    setCartItems({}); // Clear cart state in memory
  };

  // Define context value here and pass it to the provider
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    logout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;







// if (localStorage.getItem("auth-token")) {
//     fetch("http://localhost:4000/getcart", {
//       method: "post",
//       headers: {
//         Accept: "application/form-data",
//         "auth-token": `${localStorage.getItem("auth-token")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         authToken: localStorage.getItem("auth-token"),
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Failed to fetch cart: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => setCartItems(data))
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//         // Handle error gracefully (e.g., display error message to user)
//       });
//   }
// }, []);
// // console.log(cartItems);

// const addToCart = (itemId) => {
//   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//   if (localStorage.getItem("auth-token")) {
//     fetch("http://localhost:4000/addtocart", {
//       method: "post",
//       headers: {
//         Accept: "application/form-data",
//         "auth-token": `${localStorage.getItem("auth-token")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ itemId: itemId }),
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }
// };

// const removeFromCart = (itemId) => {
//   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//   if (localStorage.getItem("auth-token")) {
//     fetch("http://localhost:4000/removefromcart", {
//       method: "post",
//       headers: {
//         Accept: "application/form-data",
//         "auth-token": `${localStorage.getItem("auth-token")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ itemId: itemId }),
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }
// }
