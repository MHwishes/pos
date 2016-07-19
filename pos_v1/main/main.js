'use strict';
let printReceipt = (inputs)=> {
  var allItems = loadAllItems();
  var cartItems = buildCartItems(inputs, allItems);

  var promotions = loadPromotions();
  var receiptItems = buildReceiptItems(cartItems, promotions);

}

let buildCartItems = (inputs, allItems)=> {
  const cartItems = [];
  for (let input of inputs) {
    const splittedInput = input.split('-');
    const barcode = splittedInput[0];
    const count = parseFloat(splittedInput[1] || 1);
    const cartItem = cartItems.find(cartItem=>cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    }
    else {
      const item = allItems.find(allItem=>allItem.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }
  return cartItems;
};

let getPromotionType = (barcode, promotions)=> {
  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
};

let discount = (cartItem, promotionType)=> {
  let freeItemCount = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE');
  {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let save = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.item.price * cartItem.count - save;

  return {save, subtotal};
};

let buildReceiptItems = (cartItems, promotions)=> {

  return cartItems.map((cartItem)=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, save}=discount(cartItem, promotionType);

    return {cartItem, subtotal, save};
  });
};


