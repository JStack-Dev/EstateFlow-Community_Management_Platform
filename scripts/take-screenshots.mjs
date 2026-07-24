import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT = path.join(__dirname, "..", "docs", "screenshots");
const FRONTEND = "http://localhost:5173";
const BACKEND = "http://localhost:8000";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function login(page, username, password) {
  await page.goto(`${FRONTEND}/#/login`, { waitUntil: "networkidle" });
  await sleep(1000);

  const usernameInput = page.locator('input[type="text"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  await usernameInput.fill(username);
  await passwordInput.fill(password);

  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();

  // Wait for URL to change away from /login (hash changes)
  await page.waitForURL((url) => !url.hash.includes("login"), { timeout: 15000 }).catch(() => {});
  await sleep(2000);
}

async function shot(page, name) {
  const filepath = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`  ✅ ${name}.png`);
}

async function main() {
  if (!fs.existsSync(OUT)) {
    fs.mkdirSync(OUT, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // --------------------------------------------------
  // 01 - Landing page Django
  // --------------------------------------------------
  console.log("📸 Capturando screenshots...");
  const page0 = await context.newPage();
  await page0.goto(`${BACKEND}/`, { waitUntil: "networkidle" });
  await sleep(1500);
  await shot(page0, "01-landing");
  await page0.close();

  // --------------------------------------------------
  // 02 - Login React
  // --------------------------------------------------
  const page1 = await context.newPage();
  await page1.goto(`${FRONTEND}/#/login`, { waitUntil: "networkidle" });
  await sleep(1500);
  await shot(page1, "02-login-react");
  await page1.close();

  // --------------------------------------------------
  // 03 - Admin Dashboard
  // --------------------------------------------------
  const pageAdmin = await context.newPage();
  await login(pageAdmin, "admin", "admin123456");
  await sleep(2000);
  await shot(pageAdmin, "03-admin-dashboard");

  // --------------------------------------------------
  // 04 - Admin User Management
  // --------------------------------------------------
  // Click "Usuarios" in sidebar by text (no page reload, preserves auth)
  const adminUsersLink = pageAdmin.locator('a:has-text("Usuarios")').first();
  if (await adminUsersLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await adminUsersLink.click();
    await pageAdmin.waitForSelector("text=Gestión de usuarios", { timeout: 10000 }).catch(() => {});
    await sleep(2000);
  } else {
    await pageAdmin.evaluate(() => { window.location.hash = "#/admin/users"; });
    await sleep(3000);
  }
  await shot(pageAdmin, "04-admin-users");
  await pageAdmin.close();

  // --------------------------------------------------
  // 05 - Staff Panel
  // --------------------------------------------------
  const pageStaff = await context.newPage();
  await login(pageStaff, "porteria", "staff123456");
  await sleep(2000);
  await shot(pageStaff, "05-staff-panel");

  // --------------------------------------------------
  // 06 - Staff Incidents
  // --------------------------------------------------
  const incLink = pageStaff.locator('a:has-text("Incidencias")').first();
  if (await incLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await incLink.click();
  } else {
    await pageStaff.evaluate(() => { window.location.hash = "#/operativa/incidencias"; });
  }
  await pageStaff.waitForSelector("text=Incidencias", { timeout: 8000 }).catch(() => {});
  await sleep(2000);
  await shot(pageStaff, "06-staff-incidents");
  await pageStaff.close();

  // --------------------------------------------------
  // 07 - Resident Dashboard
  // --------------------------------------------------
  const pageResident = await context.newPage();
  await login(pageResident, "maria", "user123456");
  await sleep(2000);
  await shot(pageResident, "07-resident-dashboard");

  // --------------------------------------------------
  // 08 - Resident New Incident
  // --------------------------------------------------
  const resIncLink = pageResident.locator('a:has-text("Incidencias")').first();
  if (await resIncLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await resIncLink.click();
  } else {
    await pageResident.evaluate(() => { window.location.hash = "#/portal/incidencias"; });
  }
  await pageResident.waitForSelector("text=Incidencias", { timeout: 8000 }).catch(() => {});
  await sleep(2000);
  // Try to click "Nueva incidencia" button if exists
  const newBtn = pageResident.locator('button:has-text("Nueva"), button:has-text("Crear"), a:has-text("Nueva"), a:has-text("Crear")').first();
  if (await newBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await newBtn.click();
    await sleep(1500);
  }
  await shot(pageResident, "08-resident-new-incident");

  // --------------------------------------------------
  // 09 - Resident Reservation
  // --------------------------------------------------
  const resLink = pageResident.locator('a:has-text("Reservas")').first();
  if (await resLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await resLink.click();
  } else {
    await pageResident.evaluate(() => { window.location.hash = "#/portal/reservas"; });
  }
  await pageResident.waitForSelector("text=Reservas", { timeout: 8000 }).catch(() => {});
  await sleep(2000);
  await shot(pageResident, "09-resident-reservation");
  await pageResident.close();

  // --------------------------------------------------
  // 10 - Login Django
  // --------------------------------------------------
  const pageDjango = await context.newPage();
  await pageDjango.goto(`${BACKEND}/login/`, { waitUntil: "networkidle" });
  await sleep(1500);
  await shot(pageDjango, "10-login-django");

  // --------------------------------------------------
  // 11 - Incidents Django
  // --------------------------------------------------
  // Login to Django session first
  await pageDjango.fill('input[name="username"]', "admin");
  await pageDjango.fill('input[name="password"]', "admin123456");
  await pageDjango.click('input[type="submit"], button[type="submit"]');
  await sleep(2000);
  await pageDjango.goto(`${BACKEND}/incidents/`, { waitUntil: "networkidle" });
  await sleep(1500);
  await shot(pageDjango, "11-incidents-django");

  // --------------------------------------------------
  // 12 - Django Admin
  // --------------------------------------------------
  await pageDjango.goto(`${BACKEND}/admin/`, { waitUntil: "networkidle" });
  await sleep(1500);
  await shot(pageDjango, "12-django-admin");
  await pageDjango.close();

  await browser.close();
  console.log("\n🎉 12 capturas generadas en docs/screenshots/");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
