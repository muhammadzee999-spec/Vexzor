// Requires EmailJS to be included in the HTML

function processCheckout(event) {
    event.preventDefault();

    // In a real app we'd verify auth here, but for now we'll just check if there's a cart
    let cart = JSON.parse(localStorage.getItem('vexzor_cart')) || [];
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById('chk-name').value;
    const email = document.getElementById('chk-email').value;
    const address = document.getElementById('chk-address').value;

    const total = cart.reduce((t, item) => t + (item.price * (item.quantity||1)), 0);

    const orderDetails = cart.map(item => `${item.name} (x${item.quantity||1})`).join(', ');

    // EmailJS Parameters Structure
    const templateParams = {
        to_name: name,
        to_email: email,
        address: address,
        order_details: orderDetails,
        total_price: '$' + total.toFixed(2),
        order_id: 'VEX-' + Math.floor(Math.random() * 1000000)
    };

    // If EmailJS is initialized on the window
    if(window.emailjs) {
        // NOTE: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual EmailJS keys!
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                alert("your order has been done");
                localStorage.removeItem('vexzor_cart'); // Clear cart
                window.location.href = 'index.html';
            }, function(error) {
                alert("Order placed, but failed to send email. Error: " + JSON.stringify(error));
            });
    } else {
        alert("your order has been done");
        localStorage.removeItem('vexzor_cart'); 
        window.location.href = 'index.html';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('checkout-form');
    if(form) form.addEventListener('submit', processCheckout);
});
