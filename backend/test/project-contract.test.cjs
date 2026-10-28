const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function flattenPostman(items, names = []) {
  for (const item of items) {
    if (item.item) flattenPostman(item.item, names);
    if (item.request) names.push(item.name);
  }
  return names;
}

test("Prisma schema contains the booking relationships", () => {
  const schema = read("prisma/schema.prisma");
  for (const model of ["User", "Movie", "Cinema", "Room", "Seat", "Showtime", "Booking", "BookingSeat"]) {
    assert.match(schema, new RegExp(`model\\s+${model}\\s+\\{`));
  }
  assert.match(schema, /@@unique\(\[showtimeId, seatId\]\)/);
});

test("Postman collection covers the core submission flows", () => {
  const collection = JSON.parse(read("postman/Movie-Booking-API.postman_collection.json"));
  const names = flattenPostman(collection.item);
  for (const name of ["Register", "Login admin", "List movies", "Cinema systems", "Seats", "Book seats", "Booking history", "Update profile", "Delete booking history"]) {
    assert.ok(names.includes(name), `Missing Postman request: ${name}`);
  }
});

test("Swagger controllers expose authenticated booking and profile operations", () => {
  const bookings = read("src/modules-api/bookings/bookings.controller.ts");
  const users = read("src/modules-api/users/users.controller.ts");
  assert.match(bookings, /@Get\('LayLichSuDatVe'\)/);
  assert.match(bookings, /@Delete\('XoaLichSuDatVe'\)/);
  assert.match(users, /@Put\('CapNhatThongTinCaNhan'\)/);
});

test("production smoke check is opt-in", async (t) => {
  if (process.env.RUN_INTEGRATION !== "1") {
    t.skip("Set RUN_INTEGRATION=1 to call the deployed API.");
    return;
  }
  const baseUrl = process.env.API_BASE_URL || "https://capstone-movie-booking.onrender.com/api";
  const response = await fetch(`${baseUrl}/docs-json`);
  assert.equal(response.status, 200);
  const document = await response.json();
  assert.ok(document.paths["/api/QuanLyNguoiDung/DangNhap"]);
  assert.ok(document.paths["/api/QuanLyDatVe/LayLichSuDatVe"]);
});
