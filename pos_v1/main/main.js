'use strict';
let printReceipt = (tags)=> {
  const allItems = loadAllItems();
  const cartItems = buildCartItems(tags, allItems);

  const promotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, promotions);

  const receipt = buildReceipt(receiptItems);

  const receiptText = buildReceiptText(receipt);

  console.log(receiptText);
};

let buildCartItems = (tags, allItems)=> {

  const cartItems = [];

  for (let tag of tags) {
    const splittedInput = tag.split('-');
    const barcode = splittedInput[0];
    const count = parseFloat(splittedInput[1] || 1);
    const cartItem = cartItems.find(cartItem=>cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count+=count;
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
    let {subtotal, save}=discount(cartItem.count, cartItem.item.price, promotionType);

    return {cartItem, subtotal, save}
  })
};

let getPromotionType = (barcode, promotions)=> {

  const promotion = promotions.find(promotion=>promotion.barcodes.some(b=>b === barcode));

  return promotion ? promotion.type : undefined;
};
let discount = (count, price, promotionType)=> {

  let subtotal = count * price;
  let save = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    save = parseInt(count / 3) * price;
  }
  subtotal -= save;

  return {subtotal, save}
};

let buildReceipt = (receiptItems)=> {

  let actualTotal = 0;
  let saveTotal = 0;

  for (const receiptItem of receiptItems) {
    actualTotal += receiptItem.subtotal;
    saveTotal += receiptItem.save;
  }

  return {receiptItems: receiptItems, actualTotal: actualTotal, saveTotal: saveTotal}
};

let buildReceiptText = (receipt)=> {

  let text = receipt.receiptItems.map(receiptItem=> {

    return `名称：${receiptItem.cartItem.item.name}，\
数量：${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}，\
单价：${formatMoney(receiptItem.cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${text}
----------------------
总计：${formatMoney(receipt.actualTotal)}(元)
节省：${formatMoney(receipt.saveTotal)}(元)
**********************`;
};

function formatMoney(money) {

  return money.toFixed(2);
}
