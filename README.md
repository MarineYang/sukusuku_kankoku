# sukusuku_kankoku
라인 메세지 api를 이용한 한국어 학습 챗봇 개발

## 📌 LINE 한국어 학습 챗봇 – 기본 기능 구성 (MVP)

### 1️⃣ 핵심 기능

- **하루 1개 한국어 문장 제공 (자동 발송)**
  - 매일 오전 8시, 사용자의 레벨에 맞는 문장 자동 전송
  - 문장 + 일본어 번역 + 간단한 설명 포함
  - 예제 (초급): "안녕하세요! 저는 일본에서 왔어요." (こんにちは！私は日本から来ました。)

- **결제 시스템 (Stripe 연동)**
  - 결제 페이지 Stripe 연동 .
  - 무료 사용자: 하루 1개 문장 제공
  - 유료 사용자:
    - 추가 문장 제공 (예: 하루 3개)
    - 상세한 문법 설명 추가
    - 발음 오디오 (TTS) 제공
    - 결제 링크 제공 → 사용자가 웹에서 Stripe 결제 후, 유료 기능 활성화

- **기본적인 관리자 기능 (간단한 웹 대시보드)**
  - 사용자 수 & 유료 구독자 확인
  - 새로운 학습 문장 추가 가능

### 2️⃣ 기술 스택 (1인 개발 최적화)
- **LINE API**: 사용자 메시지 수신 & 자동 응답
- **Firebase**: 사용자 수준 & 구독 데이터 저장 (무료 플랜 사용)
- **백엔드**: Node.js (Express) -> 문장 생성하여 LINE 메세지 전송 서버.
- **호스팅**: Render (무료 플랜 활용) or 생각중.
- **결제**: Paddle (초기에는 정기 구독 방식)

### 3️⃣ 개발 로드맵 (4주)
- **1주차: LINE 챗봇 기본 기능 구현**
  - LINE API 연결                           ✅
  - 사용자 수준 설정 기능 개발 -- 난이도 조절기능 안함.

- **2주차: 결제 관련 렌딩페이지 설계**
  - 랜딩페이지 설계 및 구현
  - 결제 페이지 설계 및 구현                ✅
  - 결제 페이지 연동 (Paddle 결제)          ✅
  - 결제취소 기능개발
  - 결제 완료 시 유료 기능 활성화 로직 개발 
  - 무료 & 유료 사용자 구분 기능 추가

- **3주차: 학습 문장 자동 전송 기능**
  - 사용자별 맞춤 문장 발송 기능 개발
  - 문장 데이터 DB 구축

- **4주차: 테스트 & 배포**
  - 베타 테스트 진행
  - LINE 공식 계정 등록 후 운영 시작
