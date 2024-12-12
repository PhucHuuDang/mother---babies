import mongoose, { ConnectOptions } from "mongoose";
import { IUser, UserModel } from "../schema/user.schema";
import bcrypt from "bcrypt";
// import { seedDatabase } from "./seed";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/mother-and-babies" as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    console.log("MongoDB connected...");

    // Uncomment the following lines to insert initial data
    // await insertInitialData();
    // await seedDatabase().then(() => {
    //   mongoose.connection.close();
    // });
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
};

const insertInitialData = async (): Promise<void> => {
  try {
    // Check if there are any members already
    const existingMembers = await UserModel.find();
    if (existingMembers.length === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash("123456", 10); // Adjust the hashing options as needed

      // Create initial member data
      const newMemberData = {
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      } as IUser;

      // Insert into database
      await UserModel.create(newMemberData);

      console.log("Initial member data inserted.");
    } else {
      console.log("Initial member data already exists.");
    }
  } catch (error) {
    console.error(
      "Error inserting initial member data:",
      (error as Error).message
    );
  }
};

export default connectDB;
