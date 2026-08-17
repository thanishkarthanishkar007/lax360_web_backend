import { google } from "googleapis";
import path from "path";
import fs from "fs";

const renderPaths = [
  "/etc/secrets/credentials.json",
  "/etc/secrets/credential.json",
];

const localSecretPath = path.join(process.cwd(), "config/credentials.json");

let keyFilePath = null;

// Find the first Render secret path that exists
for (const p of renderPaths) {
  if (fs.existsSync(p)) {
    keyFilePath = p;
    break;
  }
}

// Fallback to local config
if (!keyFilePath) {
  keyFilePath = localSecretPath;
}

console.log("Using Google Credentials from:", keyFilePath);

if (!fs.existsSync(keyFilePath)) {
  console.error("CRITICAL ERROR: Google Credentials file not found at:", keyFilePath);
}

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});


const enquirySheetId = process.env.ENQUIRY_SHEET_ID || "1OLBTNM96FcGOnwV7hbAfpm_8fqSDvVWwInyIb6bYiu0";
const careerSheetId = process.env.CAREER_SHEET_ID || "13vHKSOaC44Oo_a8Z1TumMwQis-cqSkWguPOgndQbqU4";


const getSheets = async () => {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
};

export const saveContactToSheet = async (data) => {
  const sheets = await getSheets();

  await sheets.spreadsheets.values.append({
    spreadsheetId: enquirySheetId,
    range: "Sheet1!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.Name,
          data.email,
          data.phone,
          data.service,
          data.message,
          new Date().toLocaleString(),
        ],
      ],
    },
  });
};

export const saveCareerToSheet = async (data) => {
  const sheets = await getSheets();

  await sheets.spreadsheets.values.append({
    spreadsheetId: careerSheetId,
    range: "Sheet1!A:K",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          data.address,
          data.city,
          data.state,
          data.zip,
          data.jobTitle,
          data.resume,
          new Date().toLocaleString(),
        ],
      ],
    },
  });
};
