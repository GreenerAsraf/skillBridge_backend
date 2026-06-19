const SSLCommerzPayment = require('sslcommerz-lts');

async function test() {
  const data = {
    total_amount: 100,
    currency: 'BDT',
    tran_id: 'REF123',
    success_url: 'http://localhost/success',
    fail_url: 'http://localhost/fail',
    cancel_url: 'http://localhost/cancel',
    ipn_url: 'http://localhost/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'customer@example.com',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment('your_sslcommerz_store_id', 'your_sslcommerz_store_password', false);
  const response = await sslcz.init(data);
  console.log("Response:", response);
}
test();
