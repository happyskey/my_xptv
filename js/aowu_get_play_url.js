#!/usr/bin/env node
const axios = require('axios');
const CryptoJS = require('crypto-js');

const BASE_URL = 'https://www.aowu.tv';

const client = axios.create({
  baseURL: BASE_URL,
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 7892
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': `${BASE_URL}/play/DRAAAK-1-1/`
  }
});

function decryptAES(ciphertext, key) {
  const rawData = CryptoJS.enc.Base64.parse(ciphertext);
  const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4));
  const encrypted = CryptoJS.lib.WordArray.create(rawData.words.slice(4));
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encrypted },
    CryptoJS.enc.Utf8.parse(key),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

async function getPlayUrl(videoId) {
  console.log(`\n=== 分析視頻: ${videoId} ===\n`);
  
  console.log('[步驟1] POST /player1/encode.php');
  const plainParam = 'D-L01w37KHynBE8RfvAQBdPOLJTNf_0hUdJarYOREOJ2mQ66cKzlceFAWwoabnGqRDm14DZBTWiYJfJxeD1iQt6FB1f6NHxyirSz-F1q3uceD-sa3KvUZIyA';
  
  try {
    const res = await client.post('/player1/encode.php', `plain=${plainParam}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    });
    
    console.log('狀態:', res.status);
    console.log('響應:', JSON.stringify(res.data, null, 2));
    
    const { url, ts, sig } = res.data;
    
    console.log('\n[步驟2] 使用服務器返回的參數');
    console.log('URL:', url);
    console.log('時間戳:', ts);
    console.log('簽名:', sig);
    
    const playerUrl = `/player1/?url=${url}&ts=${ts}&sig=${sig}`;
    console.log('\n[步驟3] 播放器URL:', `${BASE_URL}${playerUrl}`);
    
    console.log('\n[步驟4] 獲取播放器頁面');
    const playerRes = await client.get(playerUrl);
    
    if (playerRes.status === 200) {
      const html = playerRes.data;
      
      // 提取加密URL和密鑰
      const encryptedUrlMatch = html.match(/const encryptedUrl = "([^"]+)"/);
      const sessionKeyMatch = html.match(/const sessionKey = "([^"]+)"/);
      
      if (encryptedUrlMatch && sessionKeyMatch) {
        const encryptedUrl = encryptedUrlMatch[1];
        const sessionKey = sessionKeyMatch[1];
        
        console.log('\n[步驟5] 解密視頻URL');
        console.log('加密URL:', encryptedUrl.substring(0, 50) + '...');
        console.log('密鑰:', sessionKey);
        
        const realUrl = decryptAES(encryptedUrl, sessionKey);
        console.log('真實URL:', realUrl);
        
        return { url, ts, sig, encryptedUrl, sessionKey, realUrl };
      } else {
        console.log('\n[步驟5] 未找到加密參數');
      }
      
      return { url, ts, sig };
    } else {
      console.log('播放器頁面狀態:', playerRes.status);
    }
    
    return { url, ts, sig };
  } catch (error) {
    console.error('錯誤:', error.message);
    if (error.response) {
      console.error('響應狀態:', error.response.status);
      console.error('響應數據:', error.response.data?.substring?.(0, 200));
    }
  }
}

const videoId = process.argv[2] || 'DRAAAK-1-1';
getPlayUrl(videoId);

module.exports = { getPlayUrl };
