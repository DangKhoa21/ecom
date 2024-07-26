'use strict';

async function addCart(id, quantity) {
    let res = await fetch('/shop/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ id, quantity })
    });

    let json = await res.json();
    document.getElementById('cart-quantity').innerText = `${json.quantity}`;
}

async function updateCart(id, quantity) {
    if (quantity > 0) {
        let res = await fetch('/shop/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id, quantity })
        });
    
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `${json.quantity}`; 
            document.getElementById('subtotal').innerText = `$${json.subtotal}`;  
            document.getElementById('total').innerText = `$${json.total}`;  
        }
    }
    else
        removeCart(id);
}

async function removeCart(id) {
    if (confirm("Do you want to remove this item from your cart?")) {
        let res = await fetch('/shop/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id })
        });
    
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `${json.quantity}`;
            if (json.quantity > 0) {
                document.getElementById('subtotal').innerText = `$${json.subtotal}`;  
                document.getElementById('total').innerText = `$${json.total}`;  
                document.getElementById(`product${id}`).remove();
            }
            else {
                document.getElementById('subtotal').innerText = `$0.00`;  
                document.getElementById('total').innerText = `$0.00`; 
                document.querySelector('.cart-info').innerHTML = 
                `<div class="text-center border py-3 rounded align-content-center">
                <h3>Your cart is empty!</h3>
                </div>`;
            }
        }
    }
}

async function clearCart() {
    if (confirm("Do you want to remove all items from your cart?")) {
        let res = await fetch('/shop/cart/all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    
        if (res.status == 200) {
            document.getElementById('cart-quantity').innerText = `0`;
            document.getElementById('subtotal').innerText = `$0.00`;  
            document.getElementById('total').innerText = `$0.00`;  
            document.querySelector('.cart-info').innerHTML = 
            `<div class="text-center border py-3 rounded align-content-center">
            <h3>Your cart is empty!</h3>
            <a class="btn border-secondary rounded-pill py-2 px-3 mt-2" href="/shop">Go Back To Shop</a>
            </div>`;
        }
    }
}

function addWishlist(id) {
    fetch('/users/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ id })
    });
}

async function removeWishlist(id) {
    if (confirm("Do you want to remove this item from your wishlist?")) {
        let res = await fetch('/users/wishlist', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id })
        });
    
        if (res.status == 200) {
            let json = await res.json();
            if (json.quantity > 0) {  
                document.getElementById(`product${id}`).remove();
            }
            else {
                document.querySelector('.wishlist-info').innerHTML = 
                `<div class="text-center border py-3 rounded align-content-center">
                <h3>Your wishlist is empty!</h3>
                <a class="btn border-secondary rounded-pill py-2 px-3 mt-2" href="/shop">Go Back To Shop</a>
                </div>`;
            }
        }
    }
}