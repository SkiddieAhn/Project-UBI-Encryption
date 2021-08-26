## 우리만의 비밀코드 '우비 암호화(UBI Encryption)' 입니다!

### 모든 문자를 U,B,I로 변경하는 암호 제작 시스템입니다.

암호라는 것이 이미지가 딱딱해서 중요성을 모르는 사람들이 많다고 생각합니다.
따라서 '우비'같이 비를 연상케 하는 친근한 이미지와 편리하게 암호를 만들 수 있는 시스템이 있으면 개선될 것이라고 기대하였습니다.
또한 기존에 암호문을 만들어 보려 했으나 복잡해서 포기한 사람들한테도 도움이 될 것이라고 생각합니다. 

<strong>ProtoType (with.C)</strong>
- https://shacoding.com/2021/01/29/%ec%9a%b0%eb%a6%ac%eb%a7%8c%ec%9d%98-%eb%b9%84%eb%b0%80%ec%bd%94%eb%93%9c-ubi-%ec%95%94%ed%98%b8%ed%99%94-prototype/

<strong>현재 기능</strong>
- RSA 기반 암호화 및 복호화 
- RSA의 공개키 e는 우코드(U_code)로, 공개키 n은 비코드(B_code)로 이용함
- 암호화: 문자열을 Encryption함수로 전달하면 암호문과 우비코드를 제공
- 복호화: 암호문과 우비코드를 Decryption함수로 전달하면 검증 후 복호문을 제공 
- 우비코드 200개 지원 (변경해서 사용할 것을 권장 / '우비코드와 보안 강화' 참고)
- 우비코드는 암호화할 때마다 변경 
- 영어 소문자, 대문자, 한글, 숫자, 일부 특수기호 처리 가능 (Inko 패키지 이용함)
- 우비코드를 입력하지 않고 복호화 가능 (스크린샷 참고)
- 변환 [숫자<->문자] 부분 업그레이드 (보안 강화, 속도 개선, 암호문 길이 축소)

<strong>다운로드</strong>
- <strong>'npm i ubicrypt'</strong>로 패키지 다운로드!

<strong>우비코드와 보안 강화</strong>
- 본 프로그램은 RSA 계산으로 구할 수 있는 모든 키를 우비코드로 사용하는 것이 아닙니다. neder_block.txt에 위치한 (n,e,d)모음만 우비코드로 사용합니다.
- neder_block.txt에 적혀 있는 문자열 중 [0:length-2]줄은 (n,e,d)모음이고 [length-1]줄(마지막 줄)은 변환에 필요한 코드입니다.
- neder_block.txt의 마지막 줄을 제외한 모든 코드를 형식에 맞게 변경해서 사용할 것을 권장합니다. 

<strong>RSA 방식과 UBI 방식의 차이점</strong>
- RSA 방식에서 암호화는 공개키(n,e), 복호화는 키(n,d)를 이용합니다.
<br><strong>-> RSA 복호화 프로그램이 있어도 개인키(d)가 없으면 해독이 어려움</strong>
- UBI 방식에서 사용자는 암호화할 때 키가 필요하지 않습니다. 그리고 프로그램은 램덤으로 공개키(n,e)를 가져와 암호화 작업을 진행합니다. 
- UBI 방식에서 사용자는 복호화할 때 공개키(n,e)를 이용합니다. 그리고 프로그램은 유효한 공개 키인지 검증 후 개인키(d)를 가져와 복호화하는 작업을 진행합니다. 
<br><strong>-> UBI 복호화 프로그램이 있으면 누구나 해독이 가능함. 그러나 이외의 모든 방법은 해독이 어려움</strong>

<strong>사용 방법</strong>
- 스크린샷 참고!!
- 스크린샷은 초기 버전이므로 최신 암호화가 적용되지 않았습니다. 
- 문의: cse@shacoding.com<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_1.PNG)<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_2.PNG)<br><br>
![screenshot](https://shacoding.com/image_directory/ubi_test_out.PNG)
