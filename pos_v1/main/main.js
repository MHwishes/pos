'use strict';
let buildCartItems=(inputs, allItems)=> {
  const cartItems = [];

  for (let input of inputs) {
    const splittedInput = input.split('-');
    var barcode = splittedInput[0];
    var count = parseFloat(splittedInput[1] || 1);
    const cartItem = cartItems.find((cartItem)=> {
      return cartItem.item.barcode === barcode;
    });

    if (cartItem) {
      cartItem.count++;
    }
    else {
      const item = allItems.find((allItem)=> {
        return allItem.barcode === barcode;
      });
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}
