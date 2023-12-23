const ContactSchema = require('./contact.model');
const UserSchema = require('./user.model');
const MessageSchema = require('./message.model');
const ProductSchema = require('./product.model');
const PaymentSchema = require('./payment.model');
const CategorySchema = require('./category.model');
const OrderSchema = require('./order.model');
const BrandSchema = require('./brand.model');
const ConfigTransitiontSchema = require('./configTransition.model')
const WalletSchema = require('./wallet.model');
const HistoryWalletSchema = require('./historyWallet.model')
const CommissionSchema = require('./commission.model')
const PaymentAdminSchema = require('./paymentAdmin.model')
const CTRL = {
  ContactSchema,
  UserSchema,
  MessageSchema,
  ProductSchema,
  PaymentSchema,
  CategorySchema,
  OrderSchema,
  BrandSchema,
  ConfigTransitiontSchema,
  WalletSchema,
  HistoryWalletSchema,
  CommissionSchema,
  PaymentAdminSchema
};
module.exports = CTRL;
