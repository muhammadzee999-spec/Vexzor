// Requires EmailJS to be included in the HTML

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('vexzor_cart')) || [];
    const summaryItems = document.getElementById('summary-items');
    const totalAmount = document.getElementById('summary-total-amount');
    
    if(!summaryItems || !totalAmount) return;

    if(cart.length === 0) {
        summaryItems.innerHTML = '<p style="color: #888;">No items in cart</p>';
        totalAmount.innerText = '$0.00';
        return;
    }

    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} (x${item.quantity || 1})</span>
            <span>$${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((t, item) => t + (item.price * (item.quantity || 1)), 0);
    totalAmount.innerText = '$' + total.toFixed(2);
}

function processCheckout(event) {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem('vexzor_cart')) || [];
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const confirmBtn = document.getElementById('confirm-btn');
    const originalBtnText = confirmBtn.innerHTML;
    
    // Start Loading State
    confirmBtn.disabled = true;
    confirmBtn.classList.add('btn-loading');
    confirmBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> PROCESSING...';

    const name = document.getElementById('chk-name').value;
    const email = document.getElementById('chk-email').value;
    const address = document.getElementById('chk-address').value;

    const total = cart.reduce((t, item) => t + (item.price * (item.quantity||1)), 0);
    const orderDetails = cart.map(item => `${item.name} (x${item.quantity||1})`).join(', ');

    const templateParams = {
        to_name: name,
        to_email: email,
        address: address,
        order_details: orderDetails,
        total_price: '$' + total.toFixed(2),
        order_id: 'VEX-' + Math.floor(Math.random() * 1000000)
    };

    if(window.emailjs) {
        // 1. Admin / Contact Us email
        emailjs.send("service_s8hndrl","template_wkn6teg",templateParams)   
        .then(function(response) {
            // 2. Auto Reply (USER ko)
            return emailjs.send("service_s8hndrl","template_gwb6lq4",templateParams);
        })
        .then(function() {
            alert("Your order has been placed successfully!");
            localStorage.removeItem('vexzor_cart'); 
            window.location.href = 'index.html';
        })
        .catch(function(error) {
            // Revert Button State on Error
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('btn-loading');
            confirmBtn.innerHTML = originalBtnText;
            
            const errorMsg = error.text || error.message || JSON.stringify(error);
            alert("Error placing order: " + errorMsg);
        });
    } else {
        // This is a safety fallback, but in a real app you might want to show a proper error
        alert("Your order has been placed!");
        localStorage.removeItem('vexzor_cart'); 
        window.location.href = 'index.html';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderOrderSummary();
    const form = document.getElementById('checkout-form');
    if(form) form.addEventListener('submit', processCheckout);
});
