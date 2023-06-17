import { AppService } from "../src/app.service";
import { getAddress } from "../src/app.service";
import { AppController } from '../src/app.controller';

describe('AppService', () => {
    let appService: AppService;
  
    beforeEach(() => {
      appService = new AppService();
    });
  
    it('should generate mnemonic and address', () => {
      const result = appService.getHD(0);
      expect(result).toBeDefined();
    });
  
    it('should generate different addresses for different indexes', () => {
      const result1 = appService.getHD(0);
      const result2 = appService.getHD(1);
      expect(result1).not.toEqual(result2);
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

