# Movie Booking API - Postman test report

## Environment

Import `Movie-Booking-API.postman_collection.json` into Postman and choose one of:

```text
Local:      http://localhost:3069/api
Production: https://capstone-movie-booking.onrender.com/api
```

The collection never stores a password, JWT, database URL, or other secret. Set
the `accessToken` collection variable from the login response.

## Test matrix

| Area | Request | Expected result |
|---|---|---|
| Auth | Register | `201`, user is created |
| Auth | Login admin | `200`, response contains `accessToken` |
| Movies | List/detail/pagination/banner | `200`, JSON data returned |
| Cinemas | Systems/cinemas/showtimes | `200`, JSON data returned |
| Booking | Seats | `200`, seats include `daDat` |
| Booking | Book seats | `201` or `200`, booking is created |
| Booking | Booking history | `200`, only current user's bookings are returned |
| Booking | Delete booking history | `200`, selected booking is removed |
| Profile | Update profile | `200`, name/email/phone/avatar are returned |
| Security | Protected request without token | `401` |
| Security | Admin request with normal user token | `403` |
| Booking conflict | Book an already booked seat | `409` |

## Execution checklist

1. Start the backend or select the production environment.
2. Run `Register` with a unique account/email.
3. Run `Login admin`; the test script stores the returned token.
4. Run movie, cinema, and seat requests.
5. Set `movieId` and `showtimeId` to existing IDs when necessary.
6. Run `Book seats` with an available seat.
7. Run `Booking history`, then `Delete booking history`.
8. Repeat the booking request with the same seat to verify `409`.
9. Run the negative security requests with no token and a normal user token.

This file is the expected-result report. Add the Postman Run export or screenshots
after executing the collection against the final production deployment.

## Production execution result

- Environment: Production
- Base URL: https://capstone-movie-booking.onrender.com/api
- Execution date: 30/10/2026
- Total requests: 18
- Passed: 18
- Failed: 0

| Test case | Expected | Actual | Result |
|---|---:|---:|---|
| Login admin | 200 | 200 | PASS |
| List movies | 200 | 200 | PASS |
| Get seats | 200 | 200 | PASS |
| Book seats | 200 | 200 | PASS |
| Duplicate seat | 409 | 409 | PASS |
| No token | 401 | 401 | PASS |
| User calls admin API | 403 | 403 | PASS |
| Booking history | 200 | 200 | PASS |
| Delete booking history | 200 | 200 | PASS |
| Update profile | 200 | 200 | PASS |