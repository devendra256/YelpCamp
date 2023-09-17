const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("DATABSE CONNECTED!!");
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
          author: '650745b7090ae9526b4ea5bb',
          location: `${cities[random100].city}, ${cities[random100].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          image:
            "https://images.unsplash.com/photo-1576226958707-5682902b836d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi, voluptas natus ratione nemo mollitia dicta maxime debitis fuga nostrum? Facere nihil doloremque soluta perferendis aperiam, optio quidem pariatur non voluptatibus.",
          price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})