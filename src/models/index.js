const ContactSchema = require('./contact.model');
const UserSchema = require('./user.model');
const MessageSchema = require('./message.model');
const ProductSchema = require('./product.model');
const PaymentSchema = require('./payment.model');
const OrderSchema = require('./order.model');
const ConfigTransitiontSchema = require('./configTransition.model')
const WalletSchema = require('./wallet.model');
const HistoryWalletSchema = require('./historyWallet.model')
const PaymentAdminSchema = require('./paymentAdmin.model')
const CTRL = {
  ContactSchema,
  UserSchema,
  MessageSchema,
  ProductSchema,
  PaymentSchema,
  OrderSchema,
  ConfigTransitiontSchema,
  WalletSchema,
  HistoryWalletSchema,
  PaymentAdminSchema
};
module.exports = CTRL;
