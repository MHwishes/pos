'use strict';
let printReceipt = (inputs)=> {
  var allItems = loadAllItems();
  var cartItems = buildCartItems(inputs, allItems);

  var promotions = loadPromotions();
  var receiptItems = buildReceiptItems(cartItems, promotions);

  let receipt = buildReceipt(receiptItems);

  buildReceiptText(receipt);
};

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

let buildReceiptItems = (cartItems, promotions)=> {

  return cartItems.map(cartItem=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, save}=discount(cartItem, promotionType);
    return {cartItem, subtotal, save}
  });
};

let getPromotionType = (barcode, promotions)=> {
  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';

};

let discount = (cartItem, promotionTye)=> {
  let freeItemCount = 0;
  if (promotionTye === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let save = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.item.price * cartItem.count - save;
  return {subtotal, save}
};

let buildReceipt = (receiptItems)=> {
  let actualTotal = 0;
  let saveTotal = 0;
  for (let receiptItem of receiptItems) {
    actualTotal += receiptItem.subtotal;
    saveTotal += receiptItem.save;
  }
  return {receiptItems: receiptItems, actualTotal: actualTotal, saveTotal: saveTotal}
};

let buildReceiptText = (receipt)=> {
  let receiptText = "***<没钱赚商店>收据***" + '\n';
  const receiptItems = receipt.receiptItems;
  for (let receiptItem  of receiptItems) {
    receiptText +=
      '名称：' + receiptItem.cartItem.item.name +
      '，数量：' + receiptItem.cartItem.count + receiptItem.cartItem.item.unit +
      '，单价：' + receiptItem.cartItem.item.price.toFixed(2) + '(元)' +
      '，小计：' + receiptItem.subtotal.toFixed(2) + '(元)' + '\n';
  }
  receiptText += '----------------------' + '\n' +
    '总计：' + receipt.actualTotal.toFixed(2) + '(元)' + '\n' +
    '节省：' + receipt.saveTotal.toFixed(2) + '(元)' + '\n' +
    '**********************';
  console.log(receiptText);
};
