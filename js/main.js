

// manages the status of the mobile menu.

document.querySelectorAll('.toggle-mobile-menu').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelector('.mobile-menu-div').classList.toggle('active');
    document.querySelector('.toggle-mobile-menu').classList.toggle('active');
    document.querySelector('.header').classList.toggle('open-menu');
    document.querySelector('body').classList.toggle('open-menu');
    document.querySelector('body').classList.toggle('trava-scroll');
  });
})



// Menu Mobile

document.querySelectorAll('.nav-menu-mobile .list-menu').forEach(li => {
  li.addEventListener('click', () => {
    li.classList.toggle('active')
  })
})


// Newsletter

document.querySelector('.header-newsletter button').addEventListener('click', () => {
  document.querySelector('.section-newsletter').classList.add('hide')
})

let inputEmail = document.querySelector('.input-newsletter input')
document.querySelector('.input-newsletter').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('E-mail cadastrado com sucesso!')
  localStorage.setItem('newsletter', inputEmail.value)
})


// Cart

let cart = document.querySelector('.cart');
let cartSide = document.querySelector('.cart-side');
let body = document.querySelector('body');

function openCart() {
  body.classList.add('trava-scroll')
  cart.classList.add('show');
  setTimeout(() => {
    cartSide.classList.add('active');
  }, 10)
}

function closeCart() {
  cartSide.classList.remove('active');
  setTimeout(() => {
    cart.classList.remove('show');
    body.classList.remove('trava-scroll');
  }, 300)
}

document.querySelector('.open-cart').addEventListener('click', openCart)

document.querySelector('.close-cart').addEventListener('click', closeCart)

document.addEventListener('click', (event) => {
  if (event.target == cart) {
    cartSide.classList.remove('active');
    setTimeout(() => {
      cart.classList.remove('show');
      body.classList.remove('trava-scroll');
    }, 300)
  }
})


// Products


async function callProducts() {
  const request = await fetch("../data.json");
  const response = await request.json();
  return response.products;
}

function configProductsCart() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  let totalPrice = 0;
  let totalProducts = 0;
  document.querySelector(`.list-cart`).innerHTML = '';
  if (cart) {
    cart.map((value1, index1) => {
      cart.map((item, index2) => {
        if (value1.id == item.id && index1 != index2) {
          if (!value1.qtd) {
            value1.qtd = 1;
            value1.qtd++;
          } else {
            value1.qtd++
          }
        }
      })
    })

    const newCart = cart.filter((value, index, self) =>
      index === self.findIndex((t) => {
        return t.id === value.id
      })
    )
    newCart.forEach(item => {
      totalProducts += 1 + (item.qtd ? item.qtd - 1 : 0)
      totalPrice += (item.price - item.descount) * (item.qtd ? item.qtd : 1)
      let cartClone = document.querySelector('.model .item-cart').cloneNode(true);

      cartClone.querySelector('.item-cart > img').src = item.img
      cartClone.querySelector('.name-product-cart').innerText = item.name
      cartClone.querySelector('.color-attribute').innerText = item.color
      cartClone.querySelector('.size-attribute').innerText = item.size
      if (item.qtd) {
        cartClone.querySelector('.qtd-text .qtd-product-cart').innerText = item.qtd
      } else {
        cartClone.querySelector('.qtd-text .qtd-product-cart').innerText = 1
      }
      cartClone.querySelector('.button-remove').setAttribute('data-id-product', item.id)
      cartClone.querySelector('.price-product-cart').innerText = "R$ " + (item.price - item.descount).toFixed(2)
      item.descount ? cartClone.querySelector('.total-price-product-cart').innerText = "R$ " + item.price : cartClone.querySelector('.total-price-product-cart').remove()

      document.querySelector(`.list-cart`).append(cartClone)
    })
    if (totalProducts > 0) {
      let numberCart = document.querySelector(`.number-items-cart`);
      numberCart.innerText = totalProducts;
      numberCart.style.display = 'flex';
    } else {
      let numberCart = document.querySelector(`.number-items-cart`);
      numberCart.innerText = '';
      numberCart.style.display = 'none';
    }
  }

  document.querySelector('.footer-cart .total-price').innerText = "R$ " + totalPrice.toFixed(2);

  document.querySelectorAll('.list-cart .button-remove').forEach(button => {
    button.addEventListener('click', (event) => removeProductCart(event, button.getAttribute('data-id-product')))
  })
}
configProductsCart()



async function buildHomeProducts() {
  const area = document.querySelectorAll('[data-area-products]')
  let products = await callProducts();
  area.forEach(e => {
    buildProducts(products, e.getAttribute('data-area-products'), e.getAttribute('data-limit-products'))
  })

  const buttons = document.querySelectorAll('.button-product-item')
  const buttonsCircle = document.querySelectorAll('.button-add-cart')
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => await addToCart(event, button.getAttribute('data-id')))
  })
  buttonsCircle.forEach((button) => {
    button.addEventListener('click', async (event) => await addToCart(event, button.getAttribute('data-id')))
  })
}

function buildProducts(data, area, limit) {
  data = data.slice(0, limit)
  data.forEach((product) => {
    let item = document.querySelector('.model .item-product').cloneNode(true);
    item.querySelector('.image-product-item img').src = product.img;
    item.querySelector('.name-product').innerText = product.name;
    item.querySelector('.stars img').src = product.rating;
    item.querySelector('.price-with-descount').innerText = "R$ " + (product.price - product.descount).toFixed(2);
    product.descount ? item.querySelector('.total-price').innerText = "R$ " + product.price : item.querySelector('.total-price').remove();
    item.querySelector('.button-product-item').setAttribute('data-id', product.id)
    item.querySelector('.button-add-cart').setAttribute('data-id', product.id)
    document.querySelector(`[data-area-products="${area}"]`).append(item)
  })
}

buildHomeProducts()

// Add products to cart


async function addToCart(event, idProduct) {
  event.preventDefault()
  let indiProduct;
  let cart = [];
  let products = await callProducts();
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
  }
  indiProduct = products.find((product) => {
    return product.id == idProduct
  })
  cart = [...cart, indiProduct];
  localStorage.setItem('cart', JSON.stringify(cart));
  configProductsCart()
  openCart()
}

async function removeProductCart(event, idProduct) {
  event.preventDefault()
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
  }
  const newCart = cart.findIndex((obj) => obj.id === idProduct);
  cart.splice(newCart, 1);
  localStorage.setItem('cart', JSON.stringify(cart))
  configProductsCart()
}

document.querySelector('.options-footer-cart').addEventListener('click', closeCart)