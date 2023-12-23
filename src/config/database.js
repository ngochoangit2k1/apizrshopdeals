const config = require('./config');
const mongoose = require('mongoose');
const {
  ContactSchema,
  UserSchema,
  MessageSchema,
  PaymentSchema,
  OrderSchema,
  WalletSchema,
  ConfigTransitiontSchema,
  HistoryWalletSchema,
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
  .then(() => PaymentSchema.createIndexes())
  .then(() => OrderSchema.createIndexes())
  .then(() => WalletSchema.createIndexes())
  .then(() => HistoryWalletSchema.createIndexes())
  .then(() => ConfigTransitiontSchema.createIndexes())
  .then(() => PaymentAdminSchema.createIndexes())

  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((error) =>
    console.log(`❗can not connect to database, ${error}`, error.message),
  );
