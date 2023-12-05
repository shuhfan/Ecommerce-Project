
// Function to add a product to the cart
const addToCart = async (productId, productName, price, productImage, quantity) => {
    try {
        await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                productName,
                price,
                productImage,
                quantity,
            }),
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

// Example: Add to cart button click event
document.getElementById('addToCartButton').addEventListener('click', () => {
    const productId = document.getElementById('addToCartButton').dataset.productId;
    const quantity = 1; // You can adjust this based on user input
    addToCart(productId, quantity);
});
