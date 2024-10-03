var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

// Temporary storage for bookings
const mongoURI =
  "mongodb+srv://aniajithMongodb007:1109208g@jeswacluster.inpyg8s.mongodb.net/Login?retryWrites=true&w=majority"; // replace with your MongoDB connection string

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Passenger Schema
const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  flight: {
    airline: { type: String, required: true },
    price: { type: Number, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    returnDeparture: { type: Date }, // Optional for round trips
    returnArrival: { type: Date }, // Optional for round trips
    tripType: { type: String, required: true }, // 'one-way' or 'round-trip'
  },
  passengers: [passengerSchema], // Array of passengers
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const flightSchema = new mongoose.Schema(
  {
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    duration: { type: String, required: true }, // e.g., "2h 30m"
    price: { type: Number, required: true },
    flightClass: { type: String, required: true, enum: ["Luxury", "Economy"] },
    tripType: { type: String, required: true, enum: ["one-way", "round-trip"] },
    returnDeparture: { type: Date }, // Optional for one-way flights
    returnArrival: { type: Date }, // Optional for one-way flights
    returnDuration: { type: String }, // Optional for one-way flights
    seatCount: { type: Number, default: 100 }, // New field with a default value
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Flight = mongoose.model("Flight", flightSchema);

const Booking = mongoose.model("Booking", bookingSchema);

const Location = mongoose.model("Location", locationSchema);

/* GET users listing. */

// const flights = [
//   // One-way flights: New York to Los Angeles
//   {
//     id: 1,
//     airline: "Airline A",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-01T08:00:00",
//     arrival: "2024-10-01T10:00:00",
//     duration: "2h",
//     price: 200,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },
//   {
//     id: 2,
//     airline: "Airline B",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-01T12:00:00",
//     arrival: "2024-10-01T14:00:00",
//     duration: "2h",
//     price: 300,
//     flightClass: "Luxury",
//     tripType: "one-way",
//   },
//   {
//     id: 3,
//     airline: "Airline C",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-02T18:00:00",
//     arrival: "2024-10-02T20:00:00",
//     duration: "2h",
//     price: 250,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },
//   {
//     id: 4,
//     airline: "Airline D",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-03T10:00:00",
//     arrival: "2024-10-03T12:00:00",
//     duration: "2h",
//     price: 275,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },

//   // Round-trip flights: New York to Los Angeles
//   {
//     id: 5,
//     airline: "Airline E",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-01T09:00:00",
//     arrival: "2024-10-01T11:00:00",
//     returnDeparture: "2024-10-05T15:00:00",
//     returnArrival: "2024-10-05T17:00:00",
//     duration: "2h",
//     returnDuration: "2h",
//     price: 450,
//     flightClass: "Economy",
//     tripType: "round-trip",
//   },
//   {
//     id: 6,
//     airline: "Airline F",
//     from: "New York",
//     to: "Los Angeles",
//     departure: "2024-10-02T14:00:00",
//     arrival: "2024-10-02T16:00:00",
//     returnDeparture: "2024-10-06T12:00:00",
//     returnArrival: "2024-10-06T14:00:00",
//     duration: "2h",
//     returnDuration: "2h",
//     price: 500,
//     flightClass: "Luxury",
//     tripType: "round-trip",
//   },

//   // One-way flights: New York to Miami
//   {
//     id: 7,
//     airline: "Airline G",
//     from: "New York",
//     to: "Miami",
//     departure: "2024-10-01T09:00:00",
//     arrival: "2024-10-01T11:00:00",
//     duration: "2h",
//     price: 250,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },
//   {
//     id: 8,
//     airline: "Airline H",
//     from: "New York",
//     to: "Miami",
//     departure: "2024-10-02T13:00:00",
//     arrival: "2024-10-02T15:00:00",
//     duration: "2h",
//     price: 300,
//     flightClass: "Luxury",
//     tripType: "one-way",
//   },

//   // Round-trip flights: Miami to New York
//   {
//     id: 9,
//     airline: "Airline I",
//     from: "Miami",
//     to: "New York",
//     departure: "2024-10-01T08:00:00",
//     arrival: "2024-10-01T10:00:00",
//     returnDeparture: "2024-10-07T14:00:00",
//     returnArrival: "2024-10-07T16:00:00",
//     duration: "2h",
//     returnDuration: "2h",
//     price: 375,
//     flightClass: "Economy",
//     tripType: "round-trip",
//   },
//   {
//     id: 10,
//     airline: "Airline J",
//     from: "Miami",
//     to: "New York",
//     departure: "2024-10-01T12:00:00",
//     arrival: "2024-10-01T14:00:00",
//     returnDeparture: "2024-10-07T18:00:00",
//     returnArrival: "2024-10-07T20:00:00",
//     duration: "2h",
//     returnDuration: "2h",
//     price: 425,
//     flightClass: "Luxury",
//     tripType: "round-trip",
//   },

//   // One-way flights: Los Angeles to San Francisco
//   {
//     id: 11,
//     airline: "Airline K",
//     from: "Los Angeles",
//     to: "San Francisco",
//     departure: "2024-10-01T07:00:00",
//     arrival: "2024-10-01T08:00:00",
//     duration: "1h",
//     price: 150,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },
//   {
//     id: 12,
//     airline: "Airline L",
//     from: "Los Angeles",
//     to: "San Francisco",
//     departure: "2024-10-02T10:00:00",
//     arrival: "2024-10-02T11:00:00",
//     duration: "1h",
//     price: 180,
//     flightClass: "Luxury",
//     tripType: "one-way",
//   },

//   // Round-trip flights: Los Angeles to San Francisco
//   {
//     id: 13,
//     airline: "Airline M",
//     from: "Los Angeles",
//     to: "San Francisco",
//     departure: "2024-10-03T08:00:00",
//     arrival: "2024-10-03T09:00:00",
//     returnDeparture: "2024-10-05T16:00:00",
//     returnArrival: "2024-10-05T17:00:00",
//     duration: "1h",
//     returnDuration: "1h",
//     price: 275,
//     flightClass: "Economy",
//     tripType: "round-trip",
//   },
//   {
//     id: 14,
//     airline: "Airline N",
//     from: "Los Angeles",
//     to: "San Francisco",
//     departure: "2024-10-04T11:00:00",
//     arrival: "2024-10-04T12:00:00",
//     returnDeparture: "2024-10-06T14:00:00",
//     returnArrival: "2024-10-06T15:00:00",
//     duration: "1h",
//     returnDuration: "1h",
//     price: 350,
//     flightClass: "Luxury",
//     tripType: "round-trip",
//   },

//   // One-way flights: Chicago to New York
//   {
//     id: 15,
//     airline: "Airline O",
//     from: "Chicago",
//     to: "New York",
//     departure: "2024-10-01T08:00:00",
//     arrival: "2024-10-01T11:00:00",
//     duration: "3h",
//     price: 220,
//     flightClass: "Economy",
//     tripType: "one-way",
//   },
//   {
//     id: 16,
//     airline: "Airline P",
//     from: "Chicago",
//     to: "New York",
//     departure: "2024-10-01T13:00:00",
//     arrival: "2024-10-01T16:00:00",
//     duration: "3h",
//     price: 300,
//     flightClass: "Luxury",
//     tripType: "one-way",
//   },

//   // Round-trip flights: Chicago to New York
//   {
//     id: 17,
//     airline: "Airline Q",
//     from: "Chicago",
//     to: "New York",
//     departure: "2024-10-02T09:00:00",
//     arrival: "2024-10-02T12:00:00",
//     returnDeparture: "2024-10-06T14:00:00",
//     returnArrival: "2024-10-06T17:00:00",
//     duration: "3h",
//     returnDuration: "3h",
//     price: 400,
//     flightClass: "Economy",
//     tripType: "round-trip",
//   },
//   {
//     id: 18,
//     airline: "Airline R",
//     from: "Chicago",
//     to: "New York",
//     departure: "2024-10-03T10:00:00",
//     arrival: "2024-10-03T13:00:00",
//     returnDeparture: "2024-10-07T16:00:00",
//     returnArrival: "2024-10-07T19:00:00",
//     duration: "3h",
//     returnDuration: "3h",
//     price: 450,
//     flightClass: "Luxury",
//     tripType: "round-trip",
//   },
// ];

// const updsc = async()=>{
//   // Update all flight records to set seatCount to 100
//   const result = await Flight.updateMany({}, { $set: { seatCount: 100 } });

//   console.log(`Updated ${result.modifiedCount} records.`);
// }
// updsc()

router.post("/", async function (req, res, next) {
  const {
    tripType,
    fromLocation,
    toLocation,
    departureDate,
    returnDate,
    flightClass,
  } = req.body;
  console.log("body", req.body);

  try {
    const flights = await Flight.find();
    // Filtering logic
    let filteredFlights = flights.filter((flight) => {
      // Check if the flight's trip type matches the requested trip type
      const tripTypeMatches = flight.tripType === tripType;

      // Filter by departure date
      const flightDepartureDate = new Date(flight.departure);
      const selectedDepartureDate = new Date(departureDate);

      // If it's a round trip, you may want to consider return date and reverse journey too.
      let returnTripMatches = true;
      if (tripType === "round-trip" && returnDate) {
        returnTripMatches =
          flight.from === toLocation && flight.to === fromLocation;
      }

      // Check if the flight matches the selected date and class
      return (
        tripTypeMatches && // Ensure trip type matches
        flightDepartureDate.toDateString() ===
          selectedDepartureDate.toDateString() && // Check departure date
        flight.from.toLowerCase() === fromLocation && // Check departure location
        flight.to.toLowerCase() === toLocation && // Check arrival location
        flight.flightClass === flightClass // Check flight class
      );
    });

    console.log("Filtered Flights:", filteredFlights);
    res.json(filteredFlights);
  } catch (err) {
    console.log("errr", err);
  }
});
router.get("/locations", async function (req, res) {
  // const uniqueLocations = [
  //   ...new Set(flights.flatMap((flight) => [flight.from, flight.to])),
  // ];

  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    console.log("Error fetching locations : ", err);
    res.status(500).send(err);
  }

  //res.json(uniqueLocations);
});
// Route to filter flights by month and locations
router.post("/month", async (req, res) => {
  const { fromLocation, toLocation, month } = req.body;
  console.log("body", req.body);

  // Create a date range for the specified month
  const startDate = new Date(new Date().getFullYear(), month - 1, 1); // Month is 0-indexed in JS
  const endDate = new Date(new Date().getFullYear(), month, 0); // Last day of the month

  try {
    const flights = await Flight.find();
    console.log(flights);
    // Filtering logic
    let filteredFlights = flights.filter((flight) => {
      const flightDepartureDate = new Date(flight.departure);
      const isWithinMonth =
        flightDepartureDate >= startDate && flightDepartureDate <= endDate;

      return (
        isWithinMonth && // Check if flight is within the specified month
        flight.from.toLowerCase() === fromLocation && // Check departure location
        flight.to.toLowerCase() === toLocation // Check arrival location
      );
    });

    // Sort by price (low to high) and get the top 10 flights
    const sortedFlights = filteredFlights
      .sort((a, b) => a.price - b.price)
      .slice(0, 10);

    console.log("Filtered Flights:", sortedFlights);
    res.json(sortedFlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get bookings by phone number
router.get("/bookings", async (req, res) => {
  const { phoneNumber } = req.query;
  try {
    const filteredBookings = phoneNumber
      ? await Booking.find({ phoneNumber })
      : await Booking.find(); // Return all bookings if no phone number is provided

    return res.json(filteredBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Error fetching bookings" });
  }
});

// Sample route to create a booking (add this part if you want to save bookings)
router.post("/book", async (req, res) => {
  const { phoneNumber, flight, passengers } = req.body;

  try {
    // Find the flight and check seat availability
    const flightRecord = await Flight.findById(flight._id);

    if (!flightRecord) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flightRecord.seatCount <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Create the booking
    const booking = new Booking({
      phoneNumber,
      flight: {
        airline: flightRecord.airline,
        price: flightRecord.price,
        departure: flightRecord.departure,
        arrival: flightRecord.arrival,
        returnDeparture: flight.returnDeparture,
        returnArrival: flight.returnArrival,
        tripType: flight.tripType,
      },
      passengers,
    });

    // Save the booking
    await booking.save();

    // Update the flight's seat count
    flightRecord.seatCount -= passengers.length; // Decrease the seat count by one
    await flightRecord.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/admin/flightentry", async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/admin/flights", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a flight by ID
router.put("/admin/flights/:id", async (req, res) => {
  const { id } = req.params;
  const flightData = req.body;
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(id, flightData, {
      new: true,
    }); // new true returns updated new doc
    if (!updatedFlight) return res.status(404).send("Flight not found");
    res.json(updatedFlight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/admin/locationentry", async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the location already exists
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }

    // Add new location
    const newLocation = new Location({ name });
    await newLocation.save();

    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error adding location:", error); // Log the error for debugging
    res.status(500).json({ message: "Error adding location", error });
  }
});

// router.get('/load',async()=>{
//   try {
//     flights.map(async(flight)=>{
//       const flightt = new Flight(flight);
//       await flightt.save();
//     })
//     //res.status(201).json(flight);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// })

module.exports = router;
