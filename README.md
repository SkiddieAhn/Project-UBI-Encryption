## 우리만의 비밀코드 '우비 암호화(UBI Encryption)' 입니다!

### 모든 문자를 U,B,I로 변경하는 암호 제작 시스템입니다.

암호라는 것이 이미지가 딱딱해서 중요성을 모르는 사람들이 많다고 생각합니다.
따라서 '우비'같이 비를 연상케 하는 친근한 이미지와 편리하게 암호를 만들 수 있는 시스템이 있으면 개선될 것이라고 기대하였습니다.
또한 기존에 암호문을 만들어 보려 했으나 복잡해서 포기한 사람들한테도 도움이 될 것이라고 생각합니다. 

<strong>ProtoType (with.C)</strong>
- https://shacoding.com/2021/01/29/%ec%9a%b0%eb%a6%ac%eb%a7%8c%ec%9d%98-%eb%b9%84%eb%b0%80%ec%bd%94%eb%93%9c-ubi-%ec%95%94%ed%98%b8%ed%99%94-prototype/

<strong>현재 기능</strong>
- RSA 방식 암호화 및 복호화 
- RSA의 공개키 e는 우코드(U_code)로, 공개키 n은 비코드(B_code)로 이용함
- 암호화: 문자열을 Encryption함수로 전달하면 암호문과 우비코드를 제공
- 복호화: 암호문과 우비코드를 Decryption함수로 전달하면 검증 후 복호문을 제공 
- 우비코드 200개 지원 (사용자가 추론해서 얻어낸 우비코드는 인식하지 않음)
- 우비코드는 암호화할 때마다 변경 
- 영어 소문자, 대문자, 한글, 숫자, 일부 특수기호 처리 가능 (Inko 패키지 이용함)
- 우비코드를 입력해서 복호화 가능 (우비코드만 기억하면 이전에 얻어낸 암호도 해독 가능)

<strong>다운로드</strong>
- <strong>'npm i ubicrypt'</strong>로 패키지 다운로드!

<strong>사용 방법</strong>
- 스크린샷 참고!!
- 문의: cse@shacoding.com<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_1.PNG)<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_2.PNG)<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_out.PNG)
