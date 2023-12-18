const Order = require('../models/orderModel')

const loadOrder = async(req,res)=>{
    try {
        // Retrieve all orders and populate user details
        const orders = await Order.find().populate('user');

        res.render('orders', { orders ,title:'Order Management'});
    } catch (error) {
        console.log('Admin controller error:', error);
        res.status(500).send('Internal Server Error');
    }
}

const changeOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.query;

        if (!orderId || !status) {
            return res.status(400).send('Bad Request');
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Check if the status transition is valid (e.g., 'Pending' to 'Shipped')
        if (status === 'Shipped' && order.status !== 'Pending') {
            return res.status(400).send('Invalid status transition');
        }

        order.status = status;
        await order.save();

        res.redirect('/admin/orders');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    loadOrder,
    changeOrderStatus,
}