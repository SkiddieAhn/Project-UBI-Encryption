const Inko = require('inko'); // 생성자 반환
const inko = new Inko();

// 문자열에서 한글 찾고 ``로 구분짓는 함수
const findHangeul=(string)=>{
  start=[]; // 한글 첫 글자의 인덱스가 담긴 배열
  end=[]; // 한글 끝 글자의 인덱스가 담긴 배열
  size=0; // s,e배열의 사이즈

  // 문자열의 앞과 뒤에 '_'표시 추가 (작업 상 편하려고)
  string='_'+string+'_';

  // 문자열에서 한글을 탐지해서 start,end 배열에 저장
  let find=0; // 한글 발견 시작
  [].forEach.call(string,(item,index)=>{
    // 그 후로 한글 아닌 문자 발견 (2)
    if(find === 1){
      if(string.charCodeAt(index)<10000){
        end[size++]=index-1;
        find=0;
      }
    }
    // 한글 발견 (1)
    else if(string.charCodeAt(index)>10000){
      find=1;
      start[size]=index;
    }
  })

  // 문자열에서 한글 텍스트만 앞뒤에 표시주기
  for(i=0; i<size; i++){
    // 문자열 자르고 합쳐서 한글 앞뒤에 `표시 주기
    string=string.slice(0,start[i])+String.fromCharCode(96)+string.slice(start[i],end[i]+1)+String.fromCharCode(96)+string.slice(end[i]+1,string.length);
    // 문자열에 ``표시가 생기면서 2*(i+1)만큼 크기가 증가함 -> start,end배열도 조정이 필요함
    if(i+1<size){
      start[i+1] += 2*(i+1);
      end[i+1] += 2*(i+1);
    }
  }

  // 문자열의 앞과 뒤에 '_'표시 제거
  string=string.slice(1,string.length-1);

  return string;
}

// en2ko의 특별한 버전 (``안에 있는 한글만 변환)
const special_en2ko=(string)=>{
  let start_sign=[]; // 처음 `의 인덱스가 담긴 배열
  let end_sign=[]; // 끝 `의 인덱스가 담긴 배열
  let size_sign=0; // start_sign, end_sign 배열의 사이즈

  // 문자열의 앞과 뒤에 '_'표시 추가 (작업 상 편하려고)
  string='_'+string+'_';

  let find_sign=0; // 특수문자(`) 발견 시작
  // 문자열에서 특수문자(`)를 탐지해서 start_sign,end_sign 배열에 저장
  [].forEach.call(string,(item,index)=>{
    // 특수문자 발견
    if(string.charCodeAt(index) === 96){
      // 끝 특수문자 발견 (2)
      if(find_sign === 1){
        end_sign[size_sign++]=index;
        find_sign=0;
      }
      // 처음 특수문자 발견 (1)
      else{
        find_sign=1;
        start_sign[size_sign]=index;
      }
    }
  })

  let difference_sum=0; // 차이 누적 변수
  // 문자열에서 `blabla`텍스트만 inko.en2ko로 변환하기 (한글화하기)
  for(i=0; i<size_sign; i++){
    let e_hangeul=inko.en2ko(string.slice(start_sign[i],end_sign[i]+1));
    string=string.slice(0,start_sign[i])+e_hangeul+string.slice(end_sign[i]+1,string.length);

    // 문자열 중 일부가 한글로 되면서 differenc만큼 크기가 감소함 -> start_sign, end_sign 배열도 조정이 필요함
    let difference=(end_sign[i]-start_sign[i]+1)-e_hangeul.length;
    difference_sum+=difference;
    if(i+1<size_sign){
      start_sign[i+1] -= difference_sum;
      end_sign[i+1] -= difference_sum;
    }
  }

  // 문자열의 앞과 뒤에 '_'표시 제거
  string=string.slice(1,string.length-1);

  return string;
}

// neder_block 파일: n,e,d값이 차례대로 저장된 파일
// 네더 파일 읽고 변수에 저장
const fs = require('fs');
let data = fs.readFileSync('node_modules/ubicrypt/neder_block.txt','utf8').split('\n');
let n_array=[];
let e_array=[];
let d_array=[];
data.forEach((item,index)=>{
  item=item.slice(0,item.length-1);
  n_array[index]=parseInt(item.split(' ')[0],10);
  e_array[index]=parseInt(item.split(' ')[1],10);
  d_array[index]=parseInt(item.split(' ')[2],10);
})
let neder_size=n_array.length;

// RSA 공개키 & 개인키
let e=e_array[0];
let n=n_array[0];
let d=d_array[0];

// 특수문자 배열
// 39:작은 따옴표, 10: 줄 바꿈, 96:'`'
let sign=[ ' ',',','.',';',':','(',')','!','?','%','"',String.fromCharCode(39),'-','/','*','@','^','#','$','~','&','|','<','>','+','=','[',']',String.fromCharCode(10),String.fromCharCode(96),'{','}']; // 전처리 코드: 63~94 (32개)
let distance=[63 - 32,64 - 44,65 - 46,66 - 59,67 - 58,68 - 40,69 - 41,70 - 33,71 - 63,72 - 37,73 - 34,74 - 39,75 - 45,
76 - 47,77 - 42,78 - 64,79 - 94,80 - 35,81 - 36,82 - 126,83 - 38,84 - 124,85 - 60,86 - 62,87 - 43,88 - 61,89 - 91,90 - 93,91-10,92-96,93-123,94-125]; // sign의 전처리코드와 아스키코드 간의 거리

/* 암호화 소스 */

// 전처리 코드 제작 함수 (a->1 , A->27)
const make_code=(string)=>{
    let code=[];
    [].forEach.call(string,(item,index)=>{
      // 아스키코드로 변환된 문자
      let itemA=string.charCodeAt(index);
      // 소문자 처리 (1~26)
      if(itemA >= 97 && itemA <= 122)
        code[index]=itemA-96;
      // 대문자 처리 (27~52)
      else if(itemA >= 65 && itemA <= 90)
        code[index]=itemA-38;
      // 숫자 처리 (53~62)
      else if(itemA >= 48 && itemA <= 57)
        code[index]=itemA+5;
      // 특수문자 처리 (63~94)
      else{
        for(i=0; i<sign.length; i++){
          if(item === sign[i]){
            code[index]=i+63;
            break;
          }
          else if(i===sign.length-1)
            code[index]=63; // 공백 처리
        }
      }
    });
    return code;
}

// 원 숫자 제작 함수 (1,2 -> 102 / 3,4 -> 304)
let code_idx=0; // code 배열 인덱스
const get_integer=(code)=>{
  // code_idx가 code.length 이상일 때
  if(code_idx >= code.length)
    return -1;
  // 마지막 원소를 다룰 때 (문자 개수는 홀수)
  else if(code_idx === code.length-1)
    return code[code_idx++]*100;
  // 일반적인 것을 다룰 때
  else{
    let first=code[code_idx]*100;
    let second=code[code_idx+1];
    code_idx += 2;
    return first+second;
  }
}

// 원 숫자 집합 생성 (102,304,...)
const make_Bundle=(code)=>{
  let bundle=[];
  let receive=0;
  for(i=0; (receive=get_integer(code)) !== -1; i++){
    bundle[i]=receive;
  }
  code_idx=0;
  return bundle;
}

// RSA 암호화 (C = M^e mod n) (102->3366)
const make_C=(M)=>{
  let C=1;
  for(i=0; i<e; i++){
    C*=M;
    C%=n;
  }
  return C;
}

// 암호 숫자 집합 생성 (3366,...)
const make_encode=(bundle)=>{
  let encode=[];
  bundle.forEach((item,index)=>{
    encode[index]=make_C(item);
  })
  return encode;
}

// 암호 문자열 생성 (3366->"110100100110"->"BBUBUUBUUBBUI")
const make_Estring=(encode)=>{
  let Cto2=0;
  let Estring="";

  encode.forEach((item,index)=>{
    Cto2=item.toString(2); // 10진수 암호 숫자(C) -> 2진수 문자열 (객체 배열)
    // 2진수 문자열 -> UBI 코드
    [].forEach.call(Cto2,(item2,index2)=>{
      if(item2 === '0')
        Estring += 'U';
      else if(item2 === '1')
        Estring += 'B';
    })
    Estring += 'I';
  })
  return Estring;
}

/* 복호화 소스 */

// 복호화 전처리 코드 집합 생성 (B->1, U->0, I->2 => "BBUBUUBUUBBUI" -> "1101001001102")
const make_code2=(Estring)=>{
  let code2="";
  [].forEach.call(Estring,(item,index)=>{
    if(item === 'B')
      code2 += 1;
    else if(item === 'U')
      code2 += 0;
    else {
      code2 += 2;
    }
  })
  return code2;
}

// 변환 숫자(암호 숫자) 집합 생성 ("1101001001102" ->3366, ...)
const make_c_code=(code2)=>{
  let c_code=[];
  let c_idx=0;
  let tmp=""; // 2진수 문자열 임시 저장 (else문으로 새롭게 저장)
  [].forEach.call(code2,(item,index)=>{
      if(item !== "2") // 구분점(2)이 올 때까지 tmp에 문자열 추가
        tmp += item;
      else{
        c_code[c_idx++]=parseInt(tmp,2); // 2진수 문자열 -> 10진수 변환 숫자(C)
        tmp="";
      }
  })
  return c_code;
}

// RSA 복호화 (M = C^d mod n) (3366->102)
const make_M=(C)=>{
  let M=1;
  for(i=0; i<d; i++){
    M*=C;
    M%=n;
  }
  return M;
}

// 복호 숫자 집합 생성 (102,...)
const make_decode=(c_code)=>{
  let decode=[];
  c_code.forEach((item,index)=>{
    decode[index]=make_M(item);
  })
  return decode;
}

// 전처리 코드 반환 (102->1,2)
let decode_idx=0; // decode 배열 인덱스
const get_code=(decode)=>{
  let two_num=[];

  // decode_idx가 decode.length 이상일 때
  if(decode_idx >= decode.length)
    return -1;

  // 마지막 원소를 다룰 때
	// ex) 1819 1920 2100따위일 때 2100
  else if(decode[decode_idx] % 100 === 0)
    two_num[0]=parseInt(decode[decode_idx++] / 100);

  // 일반적인 원소를 다룰 때
  else {
    two_num[0]=parseInt(decode[decode_idx] / 100);
    two_num[1]=decode[decode_idx] % 100;
    decode_idx++;
  }
  return two_num;
}

// 복호 문자열 생성 (1,2->ab)
const make_Dstring=(decode)=>{
  let Dstring=""
  let receive=[];
  let get=0;
  while((receive=get_code(decode)) !== -1){
    for(i=0; i<2; i++){
      get=receive[i];
      if(get !== undefined){
        // 영어 소문자
        if (get >= 1 && get <= 26)
          Dstring += String.fromCharCode(get+96);
        // 영어 대문자
        else if (get >= 27 && get <= 52)
          Dstring += String.fromCharCode(get+38);
        // 숫자
        else if (get >= 53 && get <= 62)
          Dstring += String.fromCharCode(get-5);
        // 특수문자
        else{
          // [넘어온 문자의 전처리 코드 -특수문자와의 거리=특수문자의 아스키 코드]일 때 성립
					// ex) 63-(63-32)=32(' ')
          for(j=0; j<sign.length; j++){
            if(String.fromCharCode(get-distance[j]) === sign[j]){
              Dstring += sign[j];
              break;
            }
          }
        }
      }
    }
  }
  decode_idx=0;
  return Dstring;
}


module.exports=UBI={
  // 우비 암호화
  Encryption:(string)=>{
    // 암호화 코드 랜덤화
    let rand_idx=Math.floor(Math.random() * neder_size);
    e=e_array[rand_idx];
    n=n_array[rand_idx];
    d=d_array[rand_idx];

    /*
      문자열 처리 파트 [ 처리할 문자열 => 매개변수로 받은 string]
    */

    // 특정 문자열(`) 제거 <해당 특수문자는 한글 처리를 위해 써야 됨>
    // -> 원 문자열이 됨
    string=string.replace(/\`/g,'');

    // 한글 체크 후 변환
    check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글을 나타내는 정규식 (문자열에서 한글을 체크하는 test함수를 지닌 객체)
    // 한글이 있으면 영어로 바꾸기
    if(check.test(string)){
      // 문자열에서 한글 찾고 ``로 구분짓기
      string=findHangeul(string);

      // 한글 -> 영어로 (기존 영어,특수문자 그대로)
      // -> 원 문자열이 됨
      string=inko.ko2en(string);
    }

    /*
      암호화 파트 [원 문자열 = string]
    */

    // 전처리 코드 생성
    let code=make_code(string);
    // 원 숫자 집합 생성
    let bundle=make_Bundle(code);
    // 암호 숫자 집합 생성
    let encode=make_encode(bundle);
    // 엄호 문자열 생성
    let Estring=make_Estring(encode);

    // 반환할 객체 생성 (암호화된 문자열, 길이, 우코드(e), 비코드(n))
    let Eobject={
      string:Estring,
      length:Estring.length,
      u_code:e,
      b_code:n
    }

    return Eobject;
  },

  // 우비 복호화
  Decryption:(Estring,input_e=e,input_n=n)=>{
    // 사용자가 입력한 공개키가 유효한지(키 배열에 있는지) 확인하고 유효하면 n,d 변경
    // 참고로 n_array는 중복 안 되게 구성됨 -> idx가 서로 어긋날 일 없음
    let key_idx=n_array.indexOf(input_n);
    if((key_idx !== -1) && (e_array[key_idx] === input_e)){
      n=input_n;
      d=d_array[key_idx];
    }
    else{
      return false;
    }

    /*
      복호화 파트
    */

    // 복호화 전처리 코드 생성
    let code2=make_code2(Estring);
    // 변환 숫자(암호 숫자) 집합 생성
    let c_code=make_c_code(code2);
    // 복호 숫자(원 숫자) 집합 생성
    let decode=make_decode(c_code);
    // 복호 문자열 생성
    let Dstring=make_Dstring(decode);

    /*
      변환 파트 (`가 있을 시:처음에 한글 변환을 했다는 증거)
    */

    if(Dstring.indexOf('`') !== -1){
      // 영어 -> 한글로 (``안에 있는 한글만 변환)
      Dstring=special_en2ko(Dstring);

      // 특정 문자열(`) 제거
      Dstring=Dstring.replace(/\`/g,'');
    }

    // 반환할 객체 생성 (복호화된 문자열, 길이)
    let Dobject={
      string:Dstring,
      length:Dstring.length,
    }
    return Dobject;
  }
}
