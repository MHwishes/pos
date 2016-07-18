'use strict';

function printReceipt(inputs) {
  const allItems = loadAllItems();
  const cartItems = buildCartItems(inputs, allItems);
}


function findCartItems(barcodeArray, allItems) {
  for (let i = 0; i < allItems.length; i++) {
    if (barcodeArray === allItems[i].barcode) {
      return allItems[i];
    }
  }
}

function findExistCartItems(input, cartItems) {
  for (let i = 0; i < cartItems.length; i++) {
    if (input === cartItems[i].item.barcode) {
      return cartItems[i];
    }
  }
  
  return false;
}

function buildCartItems(inputs, allItems) {
  var cartItems = [];
  inputs.forEach(function (input) {
    var barcodeArray = input.split('-');
    var countItem = parseFloat(barcodeArray[1] || 1);

    var item = findCartItems(barcodeArray[0], allItems);
    var cartItem = findExistCartItems(input, cartItems);
    if (cartItem) {
      cartItem.count++;
    }
    else {
      cartItems.push({item: item, count: countItem});
    }
  });

  return cartItems;
}
