# CareScope Analytics — Full Functional Build

## Run
1. Start MongoDB service.
2. `npm install`
3. `npm run seed`
4. `npm run dev`
5. Open http://localhost:5000

### Demo accounts
- Admin: admin@carescope.com / admin123
- Doctor: doctor@carescope.com / doctor123
- Reception: staff@carescope.com / staff123

## Functional modules
- JWT login/logout
- Dashboard live KPIs and recent data
- Patient create/search/view/discharge
- Appointment create/list/cancel
- Analytics charts backed by MongoDB aggregation endpoints
- Medical report create/list/view
- Settings profile/password

## Notes
MongoDB must be running at the URI in `backend/.env`.
