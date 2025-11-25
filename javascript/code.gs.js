
// --- DITO Home WoWFi Pro Store - Google Apps Script Backend ---
// This script acts as a simple database using Google Sheets.
// It handles reading all store data and writing updates back to the respective sheets.

// Global constant for the active spreadsheet
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

/**
 * Handles GET requests. The primary use is to read all data for the application's initial load.
 * @param {GoogleAppsScript.Events.DoGet} e The event parameter.
 * @returns {ContentService.TextOutput} A JSON response containing all store data.
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'read') {
      const data = {
        Products: getSheetData(SPREADSHEET, "Products"),
        Orders: getSheetData(SPREADSHEET, "Orders"),
        Customers: getSheetData(SPREADSHEET, "Customers"),
        Affiliates: getSheetData(SPREADSHEET, "Affiliates"),
        Payouts: getSheetData(SPREADSHEET, "Payouts"),
        Settings: getSettingsData(SPREADSHEET),
        BotBrain: getSheetData(SPREADSHEET, "BotBrain"),
        BotKeywords: getSheetData(SPREADSHEET, "BotKeywords"),
        BotPresets: getSheetData(SPREADSHEET, "BotPresets"),
      };
      
      // Post-process settings from a key-value pair sheet into structured objects
      const parsed = parseSettings(data.Settings || {});
      data.settings = parsed.settings;
      data.paymentSettings = parsed.paymentSettings;
      data.smtpSettings = parsed.smtpSettings;
      
      // Remove the raw settings object as it's been replaced
      delete data.Settings;

      // Return the data successfully if the action is 'read'
      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    }
    // If the action is not 'read', then it's an invalid action for a GET request.
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doGet Error: ' + err.stack);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles POST requests. Acts as a router to call specific functions for writing/updating data.
 * @param {GoogleAppsScript.Events.DoPost} e The event parameter.
 * @returns {ContentService.TextOutput} A JSON response indicating the status of the operation.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.payload;

    if (action === 'SYNC_PRODUCTS') return handleSyncProducts(payload);
    if (action === 'SYNC_INVENTORY') return handleSyncInventory(payload);
    if (action === 'SYNC_ORDERS') return handleSyncOrders(payload);
    if (action === 'SYNC_CUSTOMERS') return handleSyncCustomers(payload);
    if (action === 'SYNC_AFFILIATES') return handleSyncAffiliates(payload);
    if (action === 'SYNC_PAYOUTS') return handleSyncPayouts(payload);
    if (action === 'SAVE_SETTINGS') return handleSaveSettings(payload);
    if (action === 'SAVE_PAYMENT_SETTINGS') return handleSavePaymentSettings(payload);
    if (action === 'SAVE_SMTP_SETTINGS') return handleSaveSmtpSettings(payload);
    if (action === 'SYNC_BOT_BRAIN') return handleSyncBotBrain(payload);
    if (action === 'SYNC_BOT_KEYWORDS') return handleSyncBotKeywords(payload);
    if (action === 'SYNC_BOT_PRESETS') return handleSyncBotPresets(payload);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action specified in POST request.' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost Error: ' + err.stack);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Error processing POST request: ' + err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- DATA READING HELPERS ---

/**
 * A generic function to read data from any sheet and convert it to an array of objects.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The spreadsheet object.
 * @param {string} sheetName The name of the sheet to read from.
 * @returns {Array<Object>} An array of objects representing the sheet rows.
 */
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length < 2) return [];
  
  const headers = values[0].map(h => String(h).trim());
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header) { // Only add property if header is not empty
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

/**
 * Reads the 'Settings' sheet which is structured as key-value pairs.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss The spreadsheet object.
 * @returns {Object} An object containing all settings.
 */
function getSettingsData(ss) {
    const sheet = ss.getSheetByName("Settings");
    if (!sheet) return {};
    const range = sheet.getDataRange();
    const values = range.getValues();
    if (values.length < 2) return {};
    const settings = {};
    values.slice(1).forEach(row => {
        if(row[0]) { // Key must exist
            settings[row[0]] = row[1];
        }
    });
    return settings;
}

/**
 * Parses a flat key-value settings object into nested objects for the frontend.
 * @param {Object} settingsData The flat settings object from the sheet.
 * @returns {Object} An object containing structured `settings`, `paymentSettings`, and `smtpSettings`.
 */
function parseSettings(settingsData) {
    const settings = {};
    const paymentSettings = {};
    const smtpSettings = {};

    for (const key in settingsData) {
        let val = settingsData[key];
        // Attempt to parse JSON strings and booleans
        if (typeof val === 'string') {
            if (val.trim().startsWith('[') || val.trim().startsWith('{')) {
                try { val = JSON.parse(val); } catch(e) {}
            } else if (val === 'true') {
                val = true;
            } else if (val === 'false') {
                val = false;
            }
        }

        if (key.startsWith('payment.')) {
            const subKeys = key.substring(8).split('.');
            if (subKeys.length === 2) {
                if (!paymentSettings[subKeys[0]]) paymentSettings[subKeys[0]] = {};
                paymentSettings[subKeys[0]][subKeys[1]] = val;
            }
        } else if (key.startsWith('smtp.')) {
            const subKeys = key.substring(5).split('.');
            let current = smtpSettings;
            for(let i=0; i < subKeys.length - 1; i++) {
                if (!current[subKeys[i]]) current[subKeys[i]] = {};
                current = current[subKeys[i]];
            }
            current[subKeys[subKeys.length - 1]] = val;

        } else {
            const keys = key.split('.');
            let current = settings;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = val;
        }
    }

    return { settings, paymentSettings, smtpSettings };
}

// --- DATA WRITING HELPERS ---

/**
 * A generic function to clear a sheet and write new data.
 * @param {Array<Object>} data The array of objects to write.
 * @param {string} sheetName The target sheet name.
 * @param {Array<string>} headers The headers for the sheet.
 * @returns {ContentService.TextOutput} A JSON success or error response.
 */
function handleSync(data, sheetName, headers) {
  try {
    let sheet = SPREADSHEET.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SPREADSHEET.insertSheet(sheetName);
    }
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    if (data && data.length > 0) {
      const rows = data.map(obj => headers.map(header => obj[header] !== undefined ? obj[header] : ""));
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: `${sheetName} synced.` })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    Logger.log(`Sync Error in ${sheetName}: ` + e.stack);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Flattens a nested object into a single-level object with dot notation keys.
 * @param {Object} obj The object to flatten.
 * @param {string} prefix The prefix for keys.
 * @returns {Object} The flattened object.
 */
function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        const value = obj[k];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, pre + k));
        } else {
            // Stringify arrays/objects that are not being flattened further
            acc[pre + k] = typeof value === 'object' ? JSON.stringify(value) : value;
        }
        return acc;
    }, {});
}


// --- SPECIFIC HANDLERS FOR doPost ---

function handleSyncProducts(data) {
  const headers = ["id", "name", "subtitle", "description", "category", "price", "image", "commissionType", "commissionValue", "sku", "stock", "min_stock_level", "bulk_discounts_summary", "json_data"];
  return handleSync(data, "Products", headers);
}

function handleSyncInventory(data) {
  const headers = ["Product ID", "Name", "SKU", "Category", "Cost Price", "Selling Price", "Stock Level", "Min Limit", "Status", "Last Updated"];
  return handleSync(data, "Inventory", headers);
}

function handleSyncOrders(data) {
  const headers = ["id", "customer", "date", "total", "status", "items", "referralId", "commission", "paymentMethod", "proofOfPayment", "shipping_name", "shipping_phone", "shipping_address", "json_data"];
  return handleSync(data, "Orders", headers);
}

function handleSyncCustomers(data) {
  const headers = ["name", "email", "phone", "json_data"];
  return handleSync(data, "Customers", headers);
}

function handleSyncAffiliates(data) {
  const headers = [
    "id", "name", "email", "walletBalance", "totalSales", "joinDate", "status", "clicks", "lifetimeEarnings",
    "username", "password", "firstName", "middleName", "lastName", "birthDate", "gender", "mobile", "address", 
    "agencyName", "govtId", "gcashName", "gcashNumber", "json_data"
  ];
  return handleSync(data, "Affiliates", headers);
}

function handleSyncPayouts(data) {
  const headers = ["id", "affiliateId", "affiliateName", "amount", "method", "accountName", "accountNumber", "status", "dateRequested", "dateProcessed"];
  return handleSync(data, "Payouts", headers);
}

function handleSaveSettings(data) {
    const flatData = flattenObject(data);
    return updateSettingsInSheet(flatData);
}

function handleSavePaymentSettings(data) {
    const flatData = flattenObject(data, 'payment');
    return updateSettingsInSheet(flatData);
}

function handleSaveSmtpSettings(data) {
    const flatData = flattenObject(data, 'smtp');
    return updateSettingsInSheet(flatData);
}

/**
 * Intelligently updates or appends key-value pairs in the 'Settings' sheet.
 * @param {Object} flatData A flat object of settings to update.
 * @returns {ContentService.TextOutput} A JSON success or error response.
 */
function updateSettingsInSheet(flatData) {
    try {
        let sheet = SPREADSHEET.getSheetByName("Settings");
        if (!sheet) {
          sheet = SPREADSHEET.insertSheet("Settings");
          sheet.getRange(1, 1, 1, 2).setValues([["Key", "Value"]]);
        }
        
        const range = sheet.getDataRange();
        const values = range.getValues();
        const existingSettings = {};
        
        if(values.length > 1) {
            values.slice(1).forEach((row, index) => {
                if (row[0]) existingSettings[row[0]] = { value: row[1], rowIndex: index + 2 };
            });
        }
        
        const toAppend = [];
        for (const key in flatData) {
            if (existingSettings[key]) {
                // Update existing row if value is different
                if (existingSettings[key].value !== flatData[key]) {
                  sheet.getRange(existingSettings[key].rowIndex, 2).setValue(flatData[key]);
                }
            } else {
                // Queue new row for appending
                toAppend.push([key, flatData[key]]);
            }
        }
        
        if (toAppend.length > 0) {
            sheet.getRange(sheet.getLastRow() + 1, 1, toAppend.length, 2).setValues(toAppend);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Settings updated.' })).setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        Logger.log('Update Settings Error: ' + e.stack);
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}

function handleSyncBotBrain(data) {
  const headers = ["id", "topic", "response"];
  return handleSync(data, "BotBrain", headers);
}

function handleSyncBotKeywords(data) {
  const headers = ["id", "keywords", "category", "response"];
  return handleSync(data, "BotKeywords", headers);
}

function handleSyncBotPresets(data) {
  const headers = ["id", "question", "response"];
  return handleSync(data, "BotPresets", headers);
}
