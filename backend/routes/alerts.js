const express = require('express');
const router = express.Router();
const axios = require('axios');
const twilio = require('twilio');

// Initialize Twilio client dynamically per request so it works when env updates without restart
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  return accountSid && authToken ? twilio(accountSid, authToken) : null;
};

const getCounterMeasures = (condition) => {
  switch (condition.toLowerCase()) {
    case 'heavy_rain':
    case 'flood':
      return `⚠️ ALERT: ${condition.replace('_', ' ').toUpperCase()} expected. 
Counter Measures:
1. Clear drainage channels immediately.
2. Move livestock to higher ground.
3. Harvest mature crops if possible.
4. Avoid applying fertilizers/pesticides.
5. Secure farm equipment.`;
    case 'drought':
      return `⚠️ ALERT: DROUGHT conditions detected.
Counter Measures:
1. Implement drip irrigation if available.
2. Use mulching to retain soil moisture.
3. Prioritize high-value crops for watering.
4. Remove weeds to reduce water competition.`;
    case 'tsunami':
      return `⚠️ ALERT: TSUNAMI WARNING.
Counter Measures:
1. EVACUATE immediately to higher ground!
2. Do not stay to save farm equipment.
3. Follow local emergency broadcast instructions.`;
    case 'extreme_heat':
      return `⚠️ ALERT: EXTREME HEAT wave.
Counter Measures:
1. Irrigate crops during early morning/late evening.
2. Provide shade for sensitive plants and livestock.
3. Ensure continuous water supply for animals.`;
    default:
      return `⚠️ ALERT: Extreme weather conditions expected. Please take necessary precautions and stay safe.`;
  }
};

router.post('/send-alert', async (req, res) => {
  try {
    const { phoneNumber, condition } = req.body;

    if (!phoneNumber || !condition) {
      return res.status(400).json({ success: false, message: 'Phone number and condition are required' });
    }

    const messageBody = getCounterMeasures(condition);
    let errors = [];

    // --- TWILIO INTEGRATION ---
    const client = getTwilioClient();
    if (client) {
      try {
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        // Send SMS
        if (twilioPhoneNumber) {
          await client.messages.create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: phoneNumber,
          });
        }
        // Send WhatsApp
        const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // default twilio sandbox
        await client.messages.create({
          body: messageBody,
          from: twilioWhatsappNumber,
          to: `whatsapp:${phoneNumber}`,
        });

        return res.json({ success: true, message: 'Alerts sent successfully to Twilio!' });
      } catch (err) {
        errors.push(`Twilio Error: ${err.message}`);
      }
    } else {
      errors.push('Twilio Skipped: Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in .env');
    }

    // --- WHAPI.CLOUD INTEGRATION (WhatsApp) ---
    let whapiSuccess = false;
    const whapiToken = process.env.WHAPI_TOKEN;
    if (whapiToken) {
      try {
        // Whapi requires international format without the "+" sign
        const cleanPhone = phoneNumber.replace(/\+/g, '');
        const whapiResp = await axios.post('https://gate.whapi.cloud/messages/text', {
          to: cleanPhone,
          body: messageBody
        }, {
          headers: {
            'Authorization': `Bearer ${whapiToken}`,
            'Content-Type': 'application/json'
          }
        });
        whapiSuccess = true;
      } catch (err) {
        errors.push(`Whapi Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      errors.push('Whapi Skipped: Missing WHAPI_TOKEN in .env');
    }

    // If either API succeeded directly, return success without going to fallback
    if ((client && errors.length === 0) || whapiSuccess) {
        return res.json({ success: true, message: 'Alerts processed and sent successfully via connected APIs!' });
    }

    // --- FALLBACK MOCK MODE ---
    console.log('--- SMS/WHATSAPP FALLBACK MOCK MODE ---');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${messageBody}`);
    console.log(`API Warnings: ${errors.join(' | ')}`);
    console.log('-----------------------------------------');
    
    return res.json({
      success: true,
      message: 'Alert simulated successfully (Mock Mode). APIs were temporarily unavailable/blocked.',
      errors: errors
    });

  } catch (error) {
    console.error('Alert sending error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while sending alerts', error: error.message });
  }
});

module.exports = router;
