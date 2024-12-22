# UFit Application

UFit is a fitness tracking application that allows users to register, log in, and track their workouts. Users can log in using their email and password or via Google OAuth. The application provides a dashboard to view workout statistics and progress.

## Features

- User registration and login
- Google OAuth login
- Workout tracking
- Dashboard with workout statistics
- Responsive design

## Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, Passport.js
- **Authentication**: JWT, Google OAuth

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ufit.git
   cd ufit
   ```

2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   CORS_ORIGIN=http://localhost:5173
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Project Structure

### Backend

- **Controllers**: Handles the logic for user authentication, workout tracking, and dashboard data.
- **Models**: Defines the MongoDB schemas for users, workouts, and progress.
- **Routes**: Defines the API endpoints for user and fitness-related operations.
- **Utils**: Contains utility functions for error handling and token generation.

### Frontend

- **Components**: Contains the React components for the application, including the login form, dashboard, and workout tracking.
- **Assets**: Contains static assets such as images and videos.
- **Store**: Manages the global state using Zustand.
- **Styles**: Contains the Tailwind CSS configuration and custom styles.

## Key Details

### React Usage

The frontend of the UFit application is built using React, a popular JavaScript library for building user interfaces. Here are some key details about how React is used in this project:

#### Functional Components

The application primarily uses functional components, which are simpler and more concise than class components. Functional components are defined as JavaScript functions and can use hooks to manage state and side effects.

#### Hooks

React hooks are used extensively throughout the application to manage state, handle side effects, and interact with the global state. Some of the key hooks used in the project include:

- **useState**: This hook is used to manage local state within a component. For example, in the `Login` component, `useState` is used to manage the `email` and `password` state variables.

  ```jsx
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  ```

- **useEffect**: This hook is used to perform side effects in functional components. It is commonly used for data fetching, subscriptions, and manually changing the DOM. In the `Login` component, `useEffect` is used to navigate to the dashboard if the user is authenticated.

  ```jsx
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  ```

- **useNavigate**: This hook from `react-router-dom` is used to programmatically navigate to different routes. It is used in the `Login` component to navigate to the dashboard after a successful login.

  ```jsx
  const navigate = useNavigate();
  ```

#### Zustand for State Management

Zustand is used for global state management in the application. It provides a simple and scalable way to manage state across the application. The `userStore` is used to manage user-related state, such as authentication status and error messages.

  ```jsx
  const loginUser = userStore((state) => state.loginUser);
  const error = userStore((state) => state.error);
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  ```

#### Framer Motion for Animations

Framer Motion is used to add animations to the application, providing a smooth and interactive user experience. For example, in the `Login` component, Framer Motion is used to animate the appearance of the login form.

  ```jsx
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md"
  >
    {/* ... */}
  </motion.div>
  ```

#### Tailwind CSS for Styling

Tailwind CSS is used for styling the application, ensuring a responsive and modern design. Tailwind's utility-first approach allows for rapid development and easy customization.

  ```jsx
  <div className="bg-gradient-to-b from-gray-950 to-black">
    <div className="min-h-screen flex items-center justify-center">
      {/* ... */}
    </div>
  </div>
  ```

### Authentication

- **Email and Password**: Users can register and log in using their email and password. JWT tokens are used for authentication.
- **Google OAuth**: Users can log in using their Google account. Passport.js is used to handle the OAuth flow.

### Dashboard

- **Workout Statistics**: The dashboard provides an overview of the user's workout statistics, including total calories burnt, total workouts, and average calories burnt per workout.
- **Progress Tracking**: Users can track their progress over time, with insights into their workout performance and improvements.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.