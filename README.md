# Payment Dashboard System

A full-stack payment management dashboard built with NestJS (backend) and Flutter (frontend).

## Features

- **Authentication**: JWT-based login system
- **Dashboard**: Real-time payment statistics and revenue charts
- **Transactions**: Paginated list with filtering capabilities
- **Payment Simulation**: Create mock payments for testing
- **User Management**: Admin and viewer roles

## Tech Stack

- **Backend**: NestJS, MongoDB, JWT, WebSockets
- **Frontend**: Flutter, HTTP client, Charts
- **Database**: MongoDB

## Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Flutter SDK** (v3.0 or higher)
3. **MongoDB** (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if using local installation)

4. Start the backend server:
```bash
cd..
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Flutter dependencies:
```bash
flutter pub get
```

3. Run the Flutter app:
```bash
flutter run -d web
```

Or for mobile:
```bash
flutter run
```

## Default Credentials

- **Username**: admin
- **Password**: password123

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Payments
- `GET /payments` - List payments with filtering
- `GET /payments/:id` - Get payment details
- `POST /payments` - Create new payment
- `GET /payments/stats` - Get dashboard statistics

### Users
- `GET /users` - List users
- `POST /users` - Create new user

## Database Schema

### User Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String (admin/viewer),
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Collection
```javascript
{
  amount: Number,
  method: String (credit_card/debit_card/paypal/bank_transfer),
  receiver: String,
  status: String (success/failed/pending),
  description: String (optional),
  transactionId: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## Sample Data

The application automatically creates:
- Default admin user (admin/password123)
- Sample payment transactions for testing

## Features Implemented

✅ JWT Authentication
✅ Dashboard with statistics
✅ Transaction listing with pagination
✅ Payment filtering by status, method, date
✅ Payment creation (simulation)
✅ Revenue charts
✅ Responsive design
✅ Error handling

## Future Enhancements

- Real-time updates with WebSockets
- CSV export functionality
- Advanced reporting
- Email notifications
- Payment gateway integration

## Screenshots

[Add screenshots of your application here]

## Deployment

### Backend Deployment (Render/Heroku)
1. Create account on Render/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Netlify/Vercel)
1. Build Flutter web app: `flutter build web`
2. Deploy `build/web` folder to hosting service

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.