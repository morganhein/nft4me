package tests

import (
	"fmt"
	"testing"
)

func TestScramble(t *testing.T) {
	org := `
UY1035 TM4TXUN;
R30Y e3a150.eU1TQ3 UY1035 cgu;
1M354 = 4Q5();
13U7M5Q_WQa = "NEIEOLFERQORRKOIGDQNOPNDKDKRLIODKIPCRLRDLOGKIKHLKRCQEENNRMDJKOCROFHDPOPFROKGHDKCDLIDMHNMODPMECNLDQIDPDGPIPJPOHKPRIDQPKEJPHQCRKON";
WQa = TM4TXUN.4TMEHI("".V0UZ(4035QP(1M354)).QZO0PQ()).PUSQ45();
U7 = TM4TXUN.4TMEHI("8QM3QEG".QZO0PQ()).PUSQ45();
MQ4 = cgu.ZQ8(WQa, cgu.oqfg_ede, U7[:cgu.NX0OW_4UbQ]);
13UZ5(MQ4.PQO3a15(Na5Q4.R30YTQ9(13U7M5Q_WQa)).PQO0PQ())
`
	ogBytes := []byte(org)
	var newBytes []byte
	offset := 1
	for offset > 40 {
		for _, b := range ogBytes {
			newBytes = append(newBytes, b+byte(offset))
		}
		fmt.Println(string(newBytes))
		offset--
		fmt.Println("")
	}

}


import hashlib
from crypto.cipher import AES
parts = set()
private_key = "neieolferqorrkoigdqnopndkdkrliodkipcrlrdlogkikhlkrcqeennrmdjkocrofhdpopfrokghdkcdlidmhnmodpmecnldqidpdgpipjpohkpridqpkejphqcrkon"
key = hashlib.sha256("".join(sorted(parts)).encode()).digest()
iv = hashlib.sha256("weare24".encode()).digest()
aes = AES.new(key, AES.ce34_212, iv[:AES.block_size])
print(aes.decrypt(bytes.fromhex(private_key)).decode())


