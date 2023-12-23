const config = require('./config');
const mongoose = require('mongoose');
const {
  ContactSchema,
  UserSchema,
  MessageSchema,
  ProductSchema,
  PaymentSchema,
  CategorySchema,
  BrandSchema,
  OrderSchema,
  WalletSchema,
  ConfigTransitiontSchema,
  HistoryWalletSchema,
  CommissionSchema,
  PaymentAdminSchema
} = require('../models');

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => ContactSchema.createIndexes())
  .then(() => UserSchema.createIndexes())
  .then(() => MessageSchema.createIndexes())
  .then(() => ProductSchema.createIndexes())
  .then(() => PaymentSchema.createIndexes())
  .then(() => CategorySchema.createIndexes())
  .then(() => OrderSchema.createIndexes())
  .then(() => BrandSchema.createIndexes())
  .then(() => WalletSchema.createIndexes())
  .then(() => HistoryWalletSchema.createIndexes())
  .then(() => CommissionSchema.createIndexes())
  .then(() => ConfigTransitiontSchema.createIndexes())
  .then(() => PaymentAdminSchema.createIndexes())

  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((error) =>
    console.log(`❗can not connect to database, ${error}`, error.message),
  );
