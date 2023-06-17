import { AppService } from "../src/app.service";
import { getAddress } from "../src/app.service";

// - 使用`describe()`和`test()`函数来组织和定义测试
// - test() 函数是 Jest 中的另一种定义测试用例的方法,效果与 it() 块是相同的
// - 使用`beforeEach()`在每个测试之前设置初始状态
// - 使用`expect()`和`toBe()`来验证期望的输出
// - 检查异常情况使用`expect(() => { ... }).toThrow()`

import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import hdkey from 'hdkey';

describe('Generate Bitcoin wallet', () => {
    test('should generate valid mnemonic', () => {
        const mnemonic = bip39.generateMnemonic();
        expect(bip39.validateMnemonic(mnemonic)).toBe(true);
    });

    test('generate a valid address', () => {
        const address = new getAddress();
        expect(address).toMatch(/^[13][a-km-zA-HJ-NP-Z0-9]{25,34}$/);
    });

    test('should generate valid seed from mnemonic', () => {
        const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        return bip39.mnemonicToSeed(mnemonic).then(seed => {
            expect(seed).toBeInstanceOf(Buffer);
            expect(seed.length).toBe(64);
        });
    });

    test('should generate valid HD wallet from seed', () => {
        const seed = '000102030405060708090a0b0c0d0e0f';
        const hdwallet = hdkey.fromMasterSeed(Buffer.from(seed, 'hex'));
        expect(hdwallet.privateKey.toString('hex')).toBe('00879d6e4859e6cb74f4a186c9c17d510542a9c0aad8e4c637bdb7102702d77339c3c373af54aa53cb0b2698ebbd39337bba9bb58baf8482d5d4d17c2da5a2b1');
    });

    test('should generate valid Bitcoin address from HD wallet', () => {
        const hdwallet = hdkey.fromMasterSeed(Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'));
        const address = bitcoin.payments.p2pkh({
            pubkey: hdwallet.derive("m/44'/0'/0'/0/0").publicKey
        }).address;
        expect(address).toBe('112t8yjnEU2M4rdCp7mtjVvtPXPUwwJ75B');
    });
});













// test('hello world test', () => {
//     expect(new AppService()).toBe(true);
// });

// describe('Bitcoin', () => {
//     // 生成的地址是否符合比特币地址格式
//     test('generate a valid address', () => {
//         const address = new getAddress();
//         expect(address).toMatch(/^[13][a-km-zA-HJ-NP-Z0-9]{25,34}$/);
//     });

//     // 对同一个私钥重复生成地址是否相同
//     it('should generate the same address for the same private key', () => {
//         const privateKey = 'c2b6b74459ef9951d93d518a288e7d473df22d2fa0c4cabb0d3f91db55fa8176';
//         const address1 = new getAddress();
//         const address2 = new getAddress();
//         expect(address1).toEqual(address2);
//     });

//     // 对不同私钥生成的地址是否不同
//     it('should generate different addresses for different private keys', () => {
//         const privateKey1 = 'c2b6b74459ef9951d93d518a288e7d473df22d2fa0c4cabb0d3f91db55fa8176';
//         const privateKey2 = '8f327f4c78d31b9ebc1813b41f43971bc1760635afe90daea157794ac509a4e6';
//         const address1 = new getAddress();
//         const address2 = new getAddress();
//         expect(address1).not.toEqual(address2);
//     });
// });

