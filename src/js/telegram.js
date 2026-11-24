/**
 * Telegram Bot Order Dispatcher
 * Sends rich, formatted order notifications directly to the configured Telegram channel.
 */

const TELEGRAM_BOT_TOKEN = '8996477429:AAHVI0KDCZqMR7XNTa-_wL-6Iav4FmAnvzw';
const TELEGRAM_CHANNEL_ID = '-1004400324624';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatUzs(usdAmount, rate) {
  const uzs = Math.round(usdAmount * rate);
  return uzs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

export function buildTelegramOrderHtml({ orderId, customer, items, totalUsd, usdToUzs, createdAt }) {
  const itemBlocks = items
    .map((item, idx) => {
      const unitUsd = item.unitPriceUsd;
      const lineTotalUsd = unitUsd * item.quantity;
      return [
        `<b>${idx + 1}. ${escapeHtml(item.name)}</b> (×${item.quantity})`,
        `   • <b>Rangi:</b> ${escapeHtml(item.colorName)} (${escapeHtml(item.colorHex)})`,
        `   • <b>Xotira / RAM:</b> ${escapeHtml(item.storageLabel)}`,
        `   • <b>SIM / Hudud:</b> ${escapeHtml(item.simLabel)}`,
        `   • <b>To'plam:</b> ${escapeHtml(item.bundleLabel)}`,
        `   • <b>Protsessor:</b> ${escapeHtml(item.processor)}`,
        `   • <b>Kamera:</b> ${escapeHtml(item.camera)}`,
        `   • <b>Narxi:</b> $${lineTotalUsd.toLocaleString('en-US')} (${formatUzs(lineTotalUsd, usdToUzs)})`
      ].join('\n');
    })
    .join('\n\n');

  const tgHandle = customer.telegram ? escapeHtml(customer.telegram) : "Ko'rsatilmagan";
  const noteText = customer.note ? escapeHtml(customer.note) : "Izoh yo'q";

  return [
    `<b>YANGI BUYURTMA · ${escapeHtml(orderId)}</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `<b>Vaqt:</b> ${escapeHtml(createdAt)}`,
    ``,
    `<b>MIJOZ MA'LUMOTLARI</b>`,
    `• <b>Ism:</b> ${escapeHtml(customer.name)}`,
    `• <b>Telefon:</b> <code>${escapeHtml(customer.phone)}</code>`,
    `• <b>Hudud:</b> ${escapeHtml(customer.city)}`,
    `• <b>Manzil:</b> ${escapeHtml(customer.address)}`,
    `• <b>To'lov turi:</b> ${escapeHtml(customer.paymentMethod)}`,
    `• <b>Telegram:</b> ${tgHandle}`,
    `• <b>Izoh:</b> ${noteText}`,
    ``,
    `<b>TANLANGAN SMARTFONLAR</b>`,
    itemBlocks,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `<b>UMUMIY SUMMA:</b> <b>$${totalUsd.toLocaleString('en-US')}</b>`,
    `<b>So'mda:</b> <b>${formatUzs(totalUsd, usdToUzs)}</b>`,
    `<b>Yetkazib berish:</b> Bepul (MobilSphere)`
  ].join('\n');
}

export async function sendOrderToTelegram(orderPayload) {
  const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const text = buildTelegramOrderHtml(orderPayload);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data || !data.ok) {
    const reason = data && data.description ? data.description : `HTTP ${response.status}`;
    throw new Error(`Telegram kanalga yuborishda xatolik: ${reason}`);
  }

  return data.result;
}
