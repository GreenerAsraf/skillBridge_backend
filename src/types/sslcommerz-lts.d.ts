declare module 'sslcommerz-lts' {
  interface SSLCommerzInitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    shipping_method?: string;
    product_name?: string;
    product_category?: string;
    product_profile?: string;
    cus_name: string;
    cus_email: string;
    cus_add1?: string;
    cus_city?: string;
    cus_country?: string;
    cus_phone?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_city?: string;
    ship_country?: string;
    multi_card_name?: string;
    [key: string]: any;
  }

  interface SSLCommerzInitResponse {
    status: string;
    failedreason?: string;
    sessionkey?: string;
    gw?: Record<string, any>;
    redirectGatewayURL?: string;
    directPaymentURLBank?: string;
    directPaymentURLCard?: string;
    directPaymentURL?: string;
    redirectGatewayURLFailed?: string;
    GatewayPageURL?: string;
    storeBanner?: string;
    storeLogo?: string;
    store_name?: string;
    desc?: Array<Record<string, any>>;
    is_direct_pay_enable?: string;
  }

  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    init(data: SSLCommerzInitData): Promise<SSLCommerzInitResponse>;
    validate(data: { val_id: string }): Promise<any>;
  }

  export = SSLCommerzPayment;
}
