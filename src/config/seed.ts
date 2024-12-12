// import mongoose, { Schema, Types } from "mongoose";
// import { IUser, IVoucher, UserModel, VoucherModel } from "../schema";
// import { faker } from "@faker-js/faker";

// // Generate fake data for users
// const roleOptions = ["admin", "user", "staff"];
// const randomRole = roleOptions[Math.floor(Math.random() * roleOptions.length)];

// export const seedDatabase = async () => {
//   try {
//     const users: IUser[] = [];
//     const vouchers: IVoucher[] = [];

//     for (let i = 0; i < 10; i++) {
//       const fakeUser: IUser = {
//         email: faker.internet.email(),
//         username: faker.internet.userName(),
//         role: randomRole as "admin" | "user" | "staff",
//         phone: faker.phone.number(),
//         avatar: faker.image.avatar(),
//         password: faker.internet.password(),
//         points: faker.datatype.number(),
//       };
//       const createdUser = await UserModel.create(fakeUser);

//       users.push(createdUser);
//     }

//     // Generate fake data for vouchers
//     for (let i = 0; i < 5; i++) {
//       const randomUserIndex = Math.floor(Math.random() * users.length);
//       const fakeVoucher: IVoucher = {
//         code: faker.number.binary(),
//         discount: faker.datatype.number({ min: 5, max: 50 }),
//         expirationDate: faker.date.future(),
//         createdBy: users[randomUserIndex]._id,
//       };

//       vouchers.push(fakeVoucher);
//     }
//     await Promise.all([
//       UserModel.insertMany(users),
//       VoucherModel.insertMany(vouchers),
//     ]);
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// };
