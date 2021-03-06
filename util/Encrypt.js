let crypto = require('crypto');

let md5Key = "mp".toString('ascii');
let aceKey = "mission";

const encryptByMd5=(clearText)=>{
    let md5 = crypto.createHmac('md5',md5Key);
    return md5.update(clearText).digest('hex').toUpperCase();
}

const encryptByMd5Key=(clearText, key)=>{
    clearText = clearText + key;

    return crypto.createHash('md5').update(clearText, 'utf8').digest("hex");
}

const encryptByMd5NoKey=(clearText)=>{
    let Buffer = require("buffer").Buffer;
    let buf = new Buffer(clearText);
    let str = buf.toString("binary");
    let md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex').toUpperCase();
}

const encryptByAES=(plainText)=>{
    let cipher = crypto.createCipher('aes-256-cbc',aceKey);
    let cipherText = cipher.update(plainText,'utf8','hex');
    cipherText += cipher.final('hex');
    return cipherText;
}

const decryptByAES=(cipherText,key)=>{
    let decipher = crypto.createDecipher('aes-256-ecb',key);
    let dec = decipher.update(cipherText,'hex','utf8');
    if(dec == null || dec.length<1){
        return null;
    }
    dec += decipher.final('utf8');

    return dec;
}

const decryption=(reqInfo, md5Key)=>{
    let reqStr = new Buffer(reqInfo, 'base64').toString('hex');
    let dec, decipher;
    decipher = crypto.createDecipheriv('aes-256-ecb', md5Key, '');
    dec = decipher.update(reqStr, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

const createActiveCode=(email,uid)=>{
    let plaintext = email + "|" +uid + "|" + (new Date().getTime());
    return encryptByAES(plaintext);
}

const resolveActiveCode=(activeCode)=>{
    try{
        let plaintext = decryptByAES(activeCode);
        if(plaintext == null){
            return null;
        }else{
            let paramArray = plaintext.split("|");
            if(paramArray != null && paramArray.length >0){
                return paramArray;
            }else{
                return null;
            }
        }
    }catch(e){
        return null;
    }
}

const createLoginEmailCode=(originEmail,newEmail,uid)=>{
    let plaintext = originEmail + "|" + newEmail + "|" +uid + "|" + (new Date().getTime());
    return encryptByAES(plaintext);
}

const resolveLoginEmailCode=(loginEmailCode)=>{
    let plaintext = decryptByAES(loginEmailCode);
    if(plaintext == null){
        return null;
    }else{
        let paramArray = plaintext.split("|");
        if(paramArray != null && paramArray.length == 4){
            let paramObj = {};
            paramObj.originEmail = paramArray[0];
            paramObj.newEmail = paramArray[1];
            paramObj.uid = paramArray[2];
            paramObj.date = paramArray[3];
            return paramObj;
        }else{
            return null;
        }
    }
}

const base64Encode=(input)=>{
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=";
    let i = 0;
    input = utf8Encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    if(output != null ){
        let l = output.length%4;
        if(l>0){
            for(;l<5;l++){
                output = output + '=';
            }
        }
    }
    return output;
}

const base64Decode=(input)=>{
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=";
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = utf8Decode(output);
    return output;
}

const utf8Encode=(string)=>{
    string = string.replace(/\r\n/g,"\n");
    let encodeText = "";
    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n);
        if (c < 128) {
            encodeText += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            encodeText += String.fromCharCode((c >> 6) | 192);
            encodeText += String.fromCharCode((c & 63) | 128);
        } else {
            encodeText += String.fromCharCode((c >> 12) | 224);
            encodeText += String.fromCharCode(((c >> 6) & 63) | 128);
            encodeText += String.fromCharCode((c & 63) | 128);
        }

    }
    return encodeText;
}

const utf8Decode=(encodeText)=>{
    let string = "";
    let i = 0;
    let c = c1 = c2 = 0;
    while ( i < encodeText.length ) {
        c = encodeText.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if((c > 191) && (c < 224)) {
            c2 = encodeText.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = encodeText.charCodeAt(i+1);
            c3 = encodeText.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}

const createGiftCode=(custId,giftId,giftCode,orderId)=>{
    let plaintext = custId + "|" +giftId +"|"+giftCode+"|"+orderId;
    return encryptByAES(plaintext);
}

const resolveGiftCode=(code)=>{
    let plaintext = decryptByAES(code);
    if(plaintext == null){
        return null;
    }else{
        let paramArray = plaintext.split("|");
        if(paramArray != null && paramArray.length == 4){
            return paramArray;
        }else{
            return null;
        }
    }
}

const getGiftOrderCode=()=>{
    let t = (new Date()).getTime();
    t = t-1000000000000;
    return t ;
}

const getNumberRandomKey=(max,min)=>{
    let Range = max - min;
    let Rand = Math.random();
    return(min + Math.round(Rand * Range));
}

const getSmsRandomKey=()=>{
    return getNumberRandomKey(9999,1000);
}

const randomString=(e)=>{
    e = e || 32;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

 const WXBizDataCrypt=(appId,sessionKey,encryptedData,iv)=>{
     // base64 decode
     sessionKey = new Buffer(sessionKey, 'base64');
     encryptedData = new Buffer(encryptedData, 'base64');
     iv = new Buffer(iv, 'base64');
     let decipher = crypto.createDecipheriv('aes-128-cbc',sessionKey,iv);
     // 设置自动 padding 为 true，删除填充补位decipher.setAutoPadding(true);
     let decoded = decipher.update(encryptedData, 'hex', 'utf8');
     decoded += decipher.final('utf8');

     decoded = JSON.parse(decoded);

     if(decoded.watermark.appid !== appId) {
         throw new Error('Illegal Buffer')
     }
    return decoded
}
module.exports = {
    encryptByMd5,
    encryptByMd5Key,
    createActiveCode,
    resolveActiveCode,
    base64Decode,
    base64Encode,
    createLoginEmailCode,
    resolveLoginEmailCode,
    encryptByMd5NoKey,
    createGiftCode,
    resolveGiftCode,
    getGiftOrderCode,
    encryptByMd5NoKey,
    getSmsRandomKey,
    randomString,
    decryption,
    WXBizDataCrypt
};