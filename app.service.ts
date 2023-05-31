import { Injectable } from '@nestjs/common';
import * as bitcoin from "bitcoinjs-lib";
import { AppController } from './app.controller';


@Injectable()
export class AppService {
  petRepository: any;
  getHello(): string {
    return 'Hello World!';
  }
  Query(arg0: string): (target: AppController, propertyKey: "findOne", parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
  }
  findPetsByTags(tags: string[]) {
    return this.petRepository.find({ tags });
  }
  generateAddress() {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
  }
  getAddress() {
    const randomBytes = require('randombytes');
    const BigInteger = require('bigi');
    const ecurve = require('ecurve');
    const crypto = require('crypto');
    const cs = require('coinstring');

    const privateKey = randomBytes(32);
    console.log("私钥:" + privateKey.toString('hex'));

    const ecparams = ecurve.getCurveByName('secp256k1');
    const curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey));
    const x = curvePt.affineX.toBuffer(32);
    const y = curvePt.affineY.toBuffer(32);
    const publicKey = Buffer.concat([Buffer.from([0x04]), x, y]);
    console.log("公钥:" + publicKey.toString('hex'));

    const compressedPublicKey = curvePt.getEncoded(true);
    if (compressedPublicKey.length === 33) {
      console.log("压缩公钥:" + compressedPublicKey.toString('hex'));
    }

    const sha = crypto.createHash('sha256').update(publicKey).digest();
    const pubkeyHash = crypto.createHash('rmd160').update(sha).digest();

    if (pubkeyHash.length === 20) {
      console.log("RIPEMD-160哈希:" + pubkeyHash.toString('hex'));
    }

    const address = cs.encode(Buffer.concat([Buffer.from([0x00]), pubkeyHash]), 0x00);
    console.log("地址:" + address);

    const wif = cs.encode(privateKey, 0x80);
    console.log("WIF:" + wif);

    const wifExt = cs.encode(Buffer.concat([privateKey, Buffer.from([0])]), 0x80);
    console.log(wifExt);

    return address;

  }
  getHD() {
    const bitcoin = require('bitcoinjs-lib');
    // 生成助记词（seed phrase）    generateMnemonic()有错误？
    const mnemonic = bitcoin.bip39.generateMnemonic();

    // 从助记词生成种子（seed）
    const seed = bitcoin.bip39.mnemonicToSeedSync(mnemonic);

    // 使用种子生成HD钱包
    const network = bitcoin.networks.bitcoin; // 可根据需要更改为其他网络
    const rootNode = bitcoin.bip32.fromSeed(seed, network);

    // 获取HD钱包的第一个接收地址和私钥
    const path = "m/0/0"; // 按照BIP32路径规范，可以更改为其他路径
    const childNode = rootNode.derivePath(path);
    const address = bitcoin.payments.p2pkh({ pubkey: childNode.publicKey, network }).address;
    const privateKey = childNode.toWIF();

    // 打印结果
    console.log("助记词 (Mnemonic):", mnemonic);
    console.log("接收地址 (Address):", address);
    console.log("私钥 (Private Key):", privateKey);
  }
  
}
