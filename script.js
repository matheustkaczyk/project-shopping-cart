const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const sectionItems = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const cartItem = document.getElementsByClassName('cart__item');
const emptyCart = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const totalPrice = document.querySelector('.total-price');
const priced = document.createElement('span');
const arrPrices = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveToLocalStorage = () => {
  localStorage.setItem('cart-item', JSON.stringify(cartItems.innerHTML));
  localStorage.setItem('valor-total', JSON.stringify(totalPrice.innerHTML));
};

const getLocalStorage = () => {
  const itensCart = localStorage.getItem('cart-item');
  cartItems.innerHTML = JSON.parse(itensCart);
  const precoTotal = localStorage.getItem('valor-total');
  totalPrice.innerHTML = JSON.parse(precoTotal);
};

// remove item clicado carrinho.
function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
      event.target.remove();
  }
}

// remove a string loading.
const loadingStr = () => {
  loading.remove();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// fetch inicial para trazer o API do mercado livre.
const getApi = async () => {
  const promiseApi = await fetch(url);
  const waitLoad = await loadingStr();
  const response = await promiseApi.json();
  response.results.forEach((item) => {
    sectionItems.appendChild(createProductItemElement(item));
  });
};

// vai populando o arrayPrices com os pre??os do itens pego no response.base_price e o coloca no totalprice.innerhtml.
const getPrice = async (price) => {
  arrPrices.push(price);
  const sumCart = arrPrices.reduce((acc, curr) => acc + curr).toFixed(2);
  priced.innerHTML = sumCart;
  totalPrice.innerHTML = `TOTAL R$: `
  totalPrice.appendChild(priced);
};

// Traz o id pego pelo evento e o pesquisa no fetch. j?? chama a fun????o do save local storage
const getApiId = async (id) => {
  const promiseId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await promiseId.json();
  cartItems.appendChild(createCartItemElement(response));
  getPrice(response.base_price);
  saveToLocalStorage();
};

// evento de clique no qual ?? checado se o target tem certa classe, se sim o target ?? levado para funcao getSku e ?? chamado o getApiId.
const evtBtn = () => {
  sectionItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = getSkuFromProductItem(event.target.parentElement);
     getApiId(id);
    }
  });
};

// d?? set = "" se o elemento pai tem filhos.
const clearCart = () => {
  emptyCart.addEventListener('click', () => {
    localStorage.clear();
    totalPrice.innerHTML = '';
    arrPrices.length = 0;
    if (cartItems.firstChild) {
      cartItems.innerHTML = '';
    }
   });
};

window.onload = function onload() {
  getLocalStorage();
  getApi();
  evtBtn();
  clearCart();
 };