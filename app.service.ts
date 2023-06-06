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
    const bip39 = require('bip39');
    // const bip32 = require('bip32');
    // 生成助记词（seed phrase）    
    const mnemonic = bip39.generateMnemonic();

    // 从助记词生成种子（seed）
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // 使用种子生成HD钱包
    const network = bitcoin.networks.testnet;
    const rootNode = bitcoin.bip32.fromSeed(seed, network);

    // 获取HD钱包的第一个接收地址和私钥
    const path = "m/0/0";
    const childNode = rootNode.derivePath(path);
    const address = bitcoin.payments.p2pkh({ pubkey: childNode.publicKey, network }).address;
    const privateKey = childNode.toWIF();

    // 打印结果
    console.log("助记词 (Mnemonic):", mnemonic);
    console.log("接收地址 (Address):", address);
    console.log("私钥 (Private Key):", privateKey);
  }
  getHDForCli() {
    const HDWallet = require('hd-address-cli')
    const mnemonic = HDWallet.cli.generateMnemonic() //随机生成助记词
    const seed = HDWallet.cli.generateSeed()  //随机生成种子
    const base58 = HDWallet.cli.generateBase58() //随机生成base58秘钥
    HDWallet.cli.generateAddress() //批量产生地址 
    // create HD Wallet methods
    HDWallet.fromMnemonic(mnemonic) // 根据助记词创建默认的BTC钱包
    HDWallet.fromSeed(seed, "TRX") // 根据seed 创建 TRX钱包
    let hdWallet = HDWallet.fromBase58(base58, "ETH") // 根据Base58创建ETH钱包
    // HD Wallet methods
    console.log('地址：' + hdWallet.derive(`m/0'/0/1`).getAddress());  //根据hdpath生成对应coin的地址
    console.log('公钥：' + hdWallet.derive(`m/0'/0/1`).getPublicKey()); //根据hdpath生成对应coin的公钥
    console.log('私钥：' + hdWallet.derive(`m/0'/0/1`).getPrivateKey()); //根据hdpath生成对应coin的私钥
    console.log('hd path:' + hdWallet.derive(`m/0'/0/1`).hdpath()); // 获取完整hd path
    console.log(hdWallet.derive(`m/0'/0/1`).getAll());
  }
  getHDForBip39() {
    const bip39 = require('bip39')
    const hdkey = require('hdkey')


    // 生成随机助记词
    const mnemonic = bip39.generateMnemonic()
    console.log(mnemonic)

    // 从助记词获取种子
    // const seed = bip39.mnemonicToSeed(mnemonic)  这里会报错,因为seed是一个Promise,不是Buffer
    // 这里seed是一个Promise对象,而不是所需的Buffer,所以调用hdkey.fromMasterSeed时报错。要修复这个错误,你需要在mnemonicToSeed的Promise resolve之后,获取seed,如下：
    bip39.mnemonicToSeed(mnemonic).then(seed => {
      // 创建HD节点
      const hdwallet = hdkey.fromMasterSeed(seed)
      // HD路径 m/44'/0'/0'/0/0 表示BTC主网 - 第一账户的第一个地址  m/44'/0'/0'/0/1 - 第一账户的第二个地址
      //       m/44'/1'/0'/0/0 表示BTC测试网 - 第一个测试账户的第一个地址    m/44'/1'/0'/0/1 - 第一个测试账户的第二个地址 
      // 主要的区别是 “44’/0’” 对应主网,而 “44’/1’”对应测试网。
      const path = "m/44'/0'/0'/0/0"
      // const childKey = hdwallet.derivePath(path)     这里会报错,因为hdwallet上没有derivePath方法
      // 这是因为hdwallet是一个由hdkey.fromMasterSeed()创建的HD节点(HDNode),而derivePath()方法存在于hdkey包上,不是HDNode实例本身。
      // const childKey = hdwallet.hdkey.derivePath(path)
      const childKey = hdwallet.derive(path)

      // 显示私钥
      console.log(childKey.privateKey)
      console.log(childKey.privateKey.toString('hex'))
      // 显示公钥
      console.log(childKey.publicKey)
      console.log(childKey.publicKey.toString('hex'))

      return childKey.privateKey.toString('hex')
    })
  }
}
